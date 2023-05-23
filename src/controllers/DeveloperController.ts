import { Request, Response } from "express";
import DeveloperService from "../services/DeveloperService";
import validateSchema from "../validators/validatorSchema";
import { DeveloperCreationSchema } from "../validators/schemas/DeveloperSchema";
import VerificationService from "../services/VerificationService";
import JWTUtil from "../utils/JWTUtils";
import developerRoles from "../data/developerRoles";
import IRequest from "../models/interfaces/IRequest";
import ClientAppService from "../services/ClientAppService";
import Developer from "../models/Developer";

export default class DeveloperController {
  private verificationService = new VerificationService();
  private developerService = new DeveloperService();
  private clientAppService = new ClientAppService();

  async getDashboard(req: IRequest, res: Response) {
    const { page } = req.query;

    const apps = await this.clientAppService.getApps(
      Number(page || 1),
      req.user?.developer as Developer
    );
    res.render("developer/dashboard", {
      page: {
        title: "Dashboard - Internet Passport",
        description: "Manage your applications",
      },
      path: req.path,
      isLoggedIn: !!req.user,
      isDeveloper: req.user && req.user.developer,
      apps,
      tab: req.query.tab,
    });
  }

  getProfile(req: IRequest, res: Response) {
    res.render("developer/profile", {
      page: {
        title: "Profile - Internet Passport",
        description: "Edit your account profile",
      },
      path: req.path,
      isLoggedIn: !!req.user,
      isDeveloper: req.user && req.user.developer,
    });
  }

  getSignupPage(req: Request, res: Response) {
    res.render("developer/signup", {
      page: {
        title: "Developer Signup - Internet Passport",
        description:
          "Start integrating Internet Passsport into your applications",
      },
      path: req.path,
      roles: developerRoles,
    });
  }

  getLoginPage(req: Request, res: Response) {
    res.render("developer/login", {
      page: {
        title: "Developer login - Internet Passport",
        description:
          "Start integrating Internet Passsport into your applications",
      },
      path: req.path,
    });
  }

  async signup(req: Request, res: Response) {
    try {
      const data = await validateSchema(DeveloperCreationSchema, req.body);
      const developer = await this.developerService.createDeveloper(data);
      const user = developer.user;

      this.verificationService
        .sendCode(user)
        .then((info) => {
          console.log(info);
          const token = JWTUtil.sign({
            payload: { email: user.email, codeSent: true },
            expiresIn: process.env["VERIFICATION_CODE_EXPIRE"],
          });
          res.redirect(`/verifyEmail?state=${token}`);
        })
        .catch((error) => {
          console.debug(error);
          const token = JWTUtil.sign({
            payload: { email: user.email, codeSent: false },
            expiresIn: process.env["VERIFICATION_CODE_EXPIRE"],
          });
          res.redirect(`/verifyEmail?state=${token}`);
        });
    } catch (error: any) {
      console.debug(error);
      res.render("developer/signup", {
        page: {
          title: "Developer Signup - Internet Passport",
          description: "Create one identity for your net surfing",
        },
        path: req.path,
        error,
        data: req.body,
        roles: developerRoles,
      });
    }
  }
}
