import { Request, Response } from "express";
import SessionAuth from "../auth/SessionAuth";
import IChangePasswordRequest from "../models/interfaces/IChangePasswordRequest";
import IRequest from "../models/interfaces/IRequest";
import { ChangePasswordSchema } from "../validators/schemas/UserSchema";
import validateSchema from "../validators/validatorSchema";
import LoginSchema from "../validators/schemas/LoginSchema";
import UserService from "../services/UserService";
import { compare } from "bcryptjs";
import JWTUtil from "../utils/JWTUtils";
import secretQuestions from "../data/secretQuestions";
import {
  AppConsentSchema,
  IdentityChallengeSchema,
} from "../validators/schemas/AuthSchema";
import { UnknownUserError } from "../models/errors/AuthError";
import UserSecret from "../models/UserSecret";
import UserApp from "../models/UserApp";
import ClientApp from "../models/ClientApp";
import UserDevice from "../models/UserDevice";
import ClientAppService from "../services/ClientAppService";
import NodemailerUtils from "../utils/NodemailerUtils";
import moment from "moment";

export default class AuthController {
  private auth = new SessionAuth();
  private userService = new UserService();
  private sessionAuth = new SessionAuth();
  private clientAppService = new ClientAppService();

  toQueryParamString(query: any) {
    let converted = "";

    for (const [k, v] of Object.entries(query)) {
      if (v) {
        converted += converted ? `&${k}=${v}` : `${k}=${v}`;
      }
    }
    return converted ? `?${converted}` : "";
  }

  async changePassword(req: IRequest, res: Response) {
    const user = req.user;
    try {
      const data: IChangePasswordRequest = await validateSchema(
        ChangePasswordSchema,
        req.body
      );
      data.userId = user?.id as string;

      const updated = await this.auth.updateUserPassword(data);
      const mailer = new NodemailerUtils();
      const token = JWTUtil.sign({
        payload: {
          user: user?.id,
        },
        expiresIn: "10m",
      });
      mailer
        .send({
          to: user?.email,
          html: `
        hi ${user?.firstname} ${
            user?.lastname
          }, we wish to let you know that your passsword was changed at ${moment().format(
            "LLL"
          )}.
        <p>
        If your are not the one that made this changes please click the link below to create a new
        strong password.
        </p>
        <br>
        <a href="${req.protocol}://${
            req.headers.host
          }/reset/password?token=${token}"></a>
        <br>
        <p><b>Note: </b>This link expires in 10 minutes</p> 
        <br>
        <br>
        <p style="text-align: center; font-size: 0.8rem"><strong>Internet Passport</strong></p>
        `,
        })
        .then((info) => {
          console.log(info);
        })
        .catch((error) => {
          console.log(error);
        });
      req.flash(
        updated ? "info" : "error",
        updated ? "Password changed successfully" : "Failed to change password"
      );
    } catch (error: any) {
      req.flash("error", error.message);
    }
    req.user?.developer
      ? res.redirect("/developer/profile")
      : res.redirect("/profile");
  }

  async logout(req: Request, res: Response) {
    const session = req.cookies["session"];

    try {
      res.cookie("session", "");
      await this.auth.logout(session);
    } catch (error: any) {
      req.flash("error", error.message);
    }
    res.redirect("/");
  }

  async login(req: Request, res: Response) {
    try {
      const data = await validateSchema(LoginSchema, req.body);
      const user = await this.userService.findUserBy({ email: data.email });
      const isMatch = await compare(data.password, user.password);
      if (!isMatch) {
        throw new Error("Wrong email and password combination");
      }

      if (!user.developer) {
        const canCompleteMFA = await this.auth.requireMFA(
          user.id,
          req.headers["user-agent"] as string
        );

        const identityToken = this.auth.createIdentityToken(user.id);
        if (canCompleteMFA) {
          return res.redirect(
            `/login/auth/identity/challenge${this.toQueryParamString({
              state: identityToken,
              client: req.query.client,
            })}`
          );
        }

        if (req.query.client) {
          return res.redirect(
            `/login/auth/consent${this.toQueryParamString({
              state: identityToken,
              client: req.query.client,
            })}`
          );
        }
      }

      const session = await this.sessionAuth.createSession({
        userAgent: req.headers["user-agent"] as string,
        userId: user.id,
      });
      res.cookie("session", session.id, {
        sameSite: true,
        secure: true,
        maxAge: 2.628e9,
      });
      user.developer
        ? res.redirect("/developer/dashboard")
        : res.redirect("/dashboard");
    } catch (error: any) {
      req.flash("error", error.message);
      res.redirect(`${req.path}${this.toQueryParamString(req.query)}`);
    }
  }

  async getIdentityChallengePage(req: Request, res: Response) {
    const { state, client } = req.query;
    let isStateValid = true;
    try {
      JWTUtil.verify({
        token: state as string,
      });
    } catch (error: any) {
      console.log(error);
      isStateValid = false;
    }
    res.render("challenge", {
      page: {
        title: "Identity Challenge - Internet Passport",
        description: "MFA challenge",
      },
      questions: secretQuestions,
      isStateValid,
      state,
      client,
    });
  }

  async processIdentityChallenge(req: Request, res: Response) {
    const { state, client } = req.body;
    let queryStr = `?state=${state}`;
    queryStr = client ? `${queryStr}&client=${client}` : queryStr;

    try {
      const data = await validateSchema(IdentityChallengeSchema, req.body);
      const jwtData = JWTUtil.verify({
        token: data.state,
      });
      const userId = jwtData.user;
      console.log(jwtData);
      const userSecret = await UserSecret.findOne({
        where: { userId, question: data.question },
      });

      if (!userSecret) {
        throw new UnknownUserError("Wrong identity combinantion");
      }

      const isMatch = await compare(data.answer, userSecret.answer);
      if (!isMatch) {
        throw new Error("Wrong identity combinantion");
      }

      if (client) {
        const userApp = await UserApp.findOne({
          where: {
            id: client,
            userId,
          },
          include: [ClientApp],
        });

        if (!userApp) {
          // redirect to consent page
          return res.redirect(
            `/login/auth/consent/?state=${state}&client=${client}`
          );
        }

        // create access token and redirect to client url
        const accessToken = this.auth.createAccessToken(
          {
            user: jwtData.user,
            client,
          },
          userApp?.client.secret as string
        );
        return res.redirect(
          `${userApp?.client.redirectURL}?code=${accessToken}`
        );
      }

      // create sesssion and redirect to dashboard
      await UserDevice.findOrCreate({
        where: { userId, userAgent: req.headers["user-agent"] },
        defaults: {
          userAgent: req.headers["user-agent"] as string,
          userId,
        },
      });

      const session = await this.sessionAuth.createSession({
        userAgent: req.headers["user-agent"] as string,
        userId,
      });

      res.cookie("session", session.id, {
        sameSite: true,
        secure: true,
        maxAge: 2.628e9,
      });
      res.redirect("/dashboard");
    } catch (error: any) {
      req.flash("error", error.message);
      res.redirect(`/login/auth/identity/challenge${queryStr}`);
    }
  }

  async getUserAppConsentPage(req: Request, res: Response) {
    const { state, client } = req.query;
    let app: ClientApp | null = null;
    let isValidSession = true;

    try {
      app = await this.clientAppService.findAppBy({ id: client });
      const jwtData = JWTUtil.verify({ token: state as string });
      const userApp = await this.userService.findAppBy({
        userId: jwtData.user,
      });

      // App allowed by user
      if (userApp) {
        const accessToken = this.auth.createAccessToken(
          { user: jwtData.user, client: app.id },
          app.secret
        );
        return res.redirect(`${app.redirectURL}?code=${accessToken}`);
      }
    } catch (error) {
      isValidSession = false;
    }

    res.render("consent", {
      page: {
        title: "Consent screen - Internet Passport",
        description: "Allow app to get your profile",
      },
      isValidSession,
      app: app?.toJSON(),
      client: req.query.client,
      state: req.query.state,
    });
  }

  async processUserAppConsent(req: Request, res: Response) {
    try {
      const jwtData = JWTUtil.verify({ token: req.body.state });
      const app = await this.clientAppService.findAppBy({
        id: req.body.client,
      });
      await validateSchema(AppConsentSchema, req.body);

      await UserApp.create({
        userId: jwtData.user,
        clientId: app.id,
      });
      const accessToken = this.auth.createAccessToken(
        {
          user: jwtData.user,
          client: app.id,
        },
        app.secret
      );
      res.redirect(`${app.redirectURL}?code=${accessToken}`);
    } catch (error: any) {
      req.flash("error", error.message);
      res.redirect(`/login/auth/consent${this.toQueryParamString(req.query)}`);
    }
  }
}
