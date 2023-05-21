import { Request, Response } from "express";

export default class DeveloperController {
  getDashboard(req: Request, res: Response) {
    res.render("developer/dashboard", {
      page: {
        title: "Dashboard - Internet Passport",
        description: "Manage your applications",
      },
      path: req.path,
    });
  }

  getProfile(req: Request, res: Response) {
    res.render("developer/profile", {
      page: {
        title: "Profile - Internet Passport",
        description: "Edit your account profile",
      },
      path: req.path,
    });
  }

  getApplicationDetails(req: Request, res: Response) {
    res.render("developer/applicationDetails", {
      page: {
        title: "Applications - Internet Passport",
        description: "manage application",
      },
      path: req.path,
    });
  }
}
