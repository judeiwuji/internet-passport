import { Request, Response } from "express";

export default class IndexController {
  getHomePage(req: Request, res: Response) {
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
    });
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
