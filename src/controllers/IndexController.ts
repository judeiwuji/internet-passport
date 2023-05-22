import { Request, Response } from "express";
import DeviceDetector from "node-device-detector";
import UserService from "../services/UserService";
import validateSchema from "../validators/validatorSchema";
import { UserCreationSchema } from "../validators/schemas/UserSchema";
import JWTUtil from "../utils/JWTUtils";
import secretQuestions from "../data/secretQuestions";
import VerificationService from "../services/VerificationService";
const detector = new DeviceDetector({
  clientIndexes: true,
  deviceIndexes: true,
  deviceAliasCode: false,
});

export default class IndexController {
  private userService = new UserService();
  private verificationService = new VerificationService();

  getHomePage(req: Request, res: Response) {
    // console.log(detector.detect(req.headers["user-agent"] as string));
    // console.log(req.useragent);
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
