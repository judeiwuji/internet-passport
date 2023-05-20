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
}
