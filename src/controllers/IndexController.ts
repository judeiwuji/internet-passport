import { Request, Response } from "express";
import UserService from "../services/UserService";
import validateSchema from "../validators/validatorSchema";
import { UserCreationSchema } from "../validators/schemas/UserSchema";
import JWTUtil from "../utils/JWTUtils";
import secretQuestions from "../data/secretQuestions";
import VerificationService from "../services/VerificationService";
import IRequest from "../models/interfaces/IRequest";

export default class IndexController {
  private userService = new UserService();
  private verificationService = new VerificationService();

  getHomePage(req: IRequest, res: Response) {
    res.render("index", {
      page: {
        title: "Internet Passport",
        description: "Provides authentication as a service",
      },
      path: req.path,
      isLoggedIn: !!req.user,
      isDeveloper: !!req.user?.developer,
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

  getLoginPage(req: Request, res: Response) {
    res.render("login", {
      page: {
        title: "Login - Internet Passport",
        description: "Login into your Internet Passport",
      },
      path: req.path,
    });
  }
}
