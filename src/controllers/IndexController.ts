import { Request, Response } from "express";

export default class IndexController {
  getHomePage(req: Request, res: Response) {
    res.render("index", {
      page: {
        title: "Internet Passport",
        description: "Provides authentication as a service",
      },
    });
  }

  getSignupPage(req: Request, res: Response) {
    res.render("signup", {
      page: {
        title: "Signup - Internet Passport",
        description: "Create one identity for your net surfing",
      },
    });
  }

  getLoginPage(req: Request, res: Response) {
    res.render("login", {
      page: {
        title: "Login - Internet Passport",
        description: "Login into your Internet Passport",
      },
    });
  }
}
