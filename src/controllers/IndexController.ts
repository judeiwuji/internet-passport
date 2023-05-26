import { Request, Response } from "express";
import UserService from "../services/UserService";
import validateSchema from "../validators/validatorSchema";
import { UserCreationSchema } from "../validators/schemas/UserSchema";
import JWTUtil from "../utils/JWTUtils";
import secretQuestions from "../data/secretQuestions";
import VerificationService from "../services/VerificationService";
import IRequest from "../models/interfaces/IRequest";
import AppConfig from "../config/appConfig";

export default class IndexController {
  private userService = new UserService();
  private verificationService = new VerificationService();

  getHomePage(req: IRequest, res: Response) {
    res.render("index", {
      page: {
        title: `${AppConfig.appName}`,
        description:
          "Your passport on the internet. Create one identity for all websites.",
      },
      path: req.path,
      isLoggedIn: !!req.user,
      isDeveloper: !!req.user?.developer,
      appName: AppConfig.appName,
    });
  }

  getSignupPage(req: Request, res: Response) {
    res.render("signup", {
      page: {
        title: `Signup - ${AppConfig.appName}`,
        description: "Create one identity for your net surfing",
      },
      path: req.path,
      questions: secretQuestions,
      appName: AppConfig.appName,
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
          title: `Signup - ${AppConfig.appName}`,
          description: "Create one identity for your net surfing",
        },
        path: req.path,
        error,
        data: req.body,
        questions: secretQuestions,
        appName: AppConfig.appName,
      });
    }
  }

  getLoginPage(req: Request, res: Response) {
    res.render("login", {
      page: {
        title: `Login - ${AppConfig.appName}`,
        description: `Login into your ${AppConfig.appName}`,
      },
      path: req.path,
      appName: AppConfig.appName,
    });
  }
}
