import { Request, Response } from "express";
import SessionAuth from "../auth/SessionAuth";
import IChangePasswordRequest from "../models/interfaces/IChangePasswordRequest";
import IRequest from "../models/interfaces/IRequest";
import { ChangePasswordSchema } from "../validators/schemas/UserSchema";
import validateSchema from "../validators/validatorSchema";
import LoginSchema from "../validators/schemas/LoginSchema";
import UserService from "../services/UserService";
import { compare, genSalt, hash } from "bcryptjs";
import JWTUtil from "../utils/JWTUtils";
import secretQuestions from "../data/secretQuestions";
import { IdentityChallengeSchema } from "../validators/schemas/AuthSchema";
import { UnknownUserError } from "../models/errors/AuthError";
import UserSecret from "../models/UserSecret";
import UserApp from "../models/UserApp";
import ClientApp from "../models/ClientApp";
import UserDevice from "../models/UserDevice";

export default class AuthController {
  private auth = new SessionAuth();
  private userService = new UserService();
  private sessionAuth = new SessionAuth();

  async canDoIdentityChallenge() {}

  async changePassword(req: IRequest, res: Response) {
    const user = req.user;
    try {
      const data: IChangePasswordRequest = await validateSchema(
        ChangePasswordSchema,
        req.body
      );
      data.userId = user?.id as string;

      const updated = await this.auth.updateUserPassword(data);
      req.flash(
        updated ? "info" : "error",
        updated ? "Password changed successfully" : "Failed to change password"
      );
    } catch (error: any) {
      req.flash("error", error.message);
    }
    res.redirect("/profile");
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
      const user = await this.userService.getUserBy({ email: data.email });
      const isMatch = await compare(data.password, user.password);
      // const isDeveloper = req.path === "/developer/login";
      if (!isMatch) {
        throw new Error("Wrong email and password combination");
      }

      // if (
      //   (!user.developer && isDeveloper) ||
      //   (user.developer && !isDeveloper)
      // ) {
      //   throw new Error("Wrong credentials");
      // }

      if (!user.developer) {
        const canCompleteMFA = await this.auth.requireMFA(
          user.id,
          req.headers["user-agent"] as string
        );

        if (canCompleteMFA) {
          const token = this.auth.createIdentityToken(user.id);
          return res.redirect(`/identity/challenge?state=${token}`);
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
      res.redirect(req.path);
    }
  }

  async clientLogin(req: Request, res: Response) {
    console.log(req.params.clientId);
    console.log(req.body);
    res.send({ status: "ok" });
  }

  async getIdentityChallengePage(req: Request, res: Response) {
    const { state, client } = req.query;
    let isStateValid = true;
    try {
      const payload = JWTUtil.verify({
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
      const userId = jwtData.payload.user;
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
          return res.redirect(`/client/apps/consent/${client}`);
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
      res.redirect(`/identity/challenge${queryStr}`);
    }
  }
}
