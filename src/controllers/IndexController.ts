import { Request, Response } from "express";
import DeviceDetector from "node-device-detector";
import UserService from "../services/UserService";
import validateSchema from "../validators/validatorSchema";
import { UserCreationSchema } from "../validators/schemas/UserSchema";
import JWTUtil from "../utils/JWTUtils";
import secretQuestions from "../data/secretQuestions";
import VerificationService from "../services/VerificationService";
import LoginSchema from "../validators/schemas/LoginSchema";
import { compare } from "bcryptjs";
import SessionAuth from "../auth/SessionAuth";
import IRequest from "../models/interfaces/IRequest";
const detector = new DeviceDetector({
  clientIndexes: true,
  deviceIndexes: true,
  deviceAliasCode: false,
});

export default class IndexController {
  private userService = new UserService();
  private verificationService = new VerificationService();
  private sessionAuth = new SessionAuth();

  getHomePage(req: IRequest, res: Response) {
    // console.log(detector.detect(req.headers["user-agent"] as string));
    // console.log(req.useragent);
    console.log(req.user);
    console.log(
      JWTUtil.sign({
        payload: { email: "judeiwuji@gmail.com", codeSent: false },
      })
    );
    res.render("index", {
      page: {
        title: "Internet Passport",
        description: "Provides authentication as a service",
      },
      path: req.path,
      isLoggedIn: !!req.user,
      isDeveloper: false,
    });
  }

  getSignupPage(req: Request, res: Response) {
    res.render("signup", {
      page: {
        title: "Signup - Internet Passport",
        description: "Create one identity for your net surfing",
      },
      path: req.path,
      questions: secretQuestions,
    });
  }

  async userSignup(req: Request, res: Response) {
    console.log(req.body);
    try {
      const data = await validateSchema(UserCreationSchema, req.body);
      const user = await this.userService.createUser(data);

      this.verificationService
        .sendCode(user)
        .then((info) => {
          console.log(info);
          const token = JWTUtil.sign({
            payload: { email: user.email, codeSent: true },
            expiresIn: "10m",
          });
          res.redirect(`/verifyEmail?state=${token}`);
        })
        .catch((error) => {
          console.debug(error);
          const token = JWTUtil.sign({
            payload: { email: user.email, codeSent: false },
            expiresIn: "10m",
          });
          res.redirect(`/verifyEmail?state=${token}`);
        });
    } catch (error: any) {
      console.debug(error);
      res.render("signup", {
        page: {
          title: "Signup - Internet Passport",
          description: "Create one identity for your net surfing",
        },
        path: req.path,
        error,
        data: req.body,
        questions: secretQuestions,
      });
    }
  }

  getDeveloperSignupPage(req: Request, res: Response) {
    res.render("developer/signup", {
      page: {
        title: "Developer Signup - Internet Passport",
        description:
          "Start integrating Internet Passsport into your applications",
      },
      path: req.path,
    });
  }

  getLoginPage(req: Request, res: Response) {
    res.render("login", {
      page: {
        title: "Login - Internet Passport",
        description: "Login into your Internet Passport",
      },
      path: req.path,
    });
  }

  async userLogin(req: Request, res: Response) {
    try {
      const data = await validateSchema(LoginSchema, req.body);
      const user = await this.userService.getUserBy({ email: data.email });
      const isMatch = await compare(data.password, user.password);
      if (!isMatch) {
        throw new Error("Wrong email and password combination");
      }

      // if (req.query.clientId) {
      //   // create accessToken and redirect to client
      // }

      const session = await this.sessionAuth.createSession({
        userAgent: req.headers["user-agent"] as string,
        userId: user.id,
      });
      res.cookie("session", session.id, {
        sameSite: true,
        secure: true,
        maxAge: 2.628e9,
      });
      res.redirect("/dashboard");
    } catch (error: any) {
      res.render("login", {
        page: {
          title: "Login - Internet Passport",
          description: "Login into your Internet Passport",
        },
        path: req.path,
        error: error.message,
        data: req.body,
      });
    }
  }

  getDeveloperLoginPage(req: Request, res: Response) {
    res.render("developer/login", {
      page: {
        title: "Developer Login - Internet Passport",
        description:
          "Login into your Internet Passport and start managing apps",
      },
      path: req.path,
    });
  }
}
