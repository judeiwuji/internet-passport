import { Request, Response } from "express";

export default class UserController {
  getDashboard(req: Request, res: Response) {
    res.render("user/dashboard", {
      page: {
        title: "Dashboard - Internet Passport",
        description: "Manage connected apps and devices",
      },
      path: req.path,
    });
  }

  getProfile(req: Request, res: Response) {
    res.render("user/profile", {
      page: {
        title: "Profile - Internet Passport",
        description: "Edit your account profile",
      },
      path: req.path,
    });
  }
}
