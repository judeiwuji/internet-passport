import { Request, Response } from "express";
import IRequest from "../models/interfaces/IRequest";
import secretQuestions from "../data/secretQuestions";
import validateSchema from "../validators/validatorSchema";
import { UserUpdateSchema } from "../validators/schemas/UserSchema";
import UserService from "../services/UserService";

export default class UserController {
  private userService = new UserService();

  getDashboard(req: IRequest, res: Response) {
    res.render("user/dashboard", {
      page: {
        title: "Dashboard - Internet Passport",
        description: "Manage connected apps and devices",
      },
      path: req.path,
      isLoggedIn: !!req.user,
      isDeveloper: false,
    });
  }

  getProfile(req: IRequest, res: Response) {
    res.render("user/profile", {
      page: {
        title: "Profile - Internet Passport",
        description: "Edit your account profile",
      },
      path: req.path,
      isLoggedIn: !!req.user,
      isDeveloper: false,
      user: req.user?.toJSON(),
      questions: secretQuestions,
    });
  }

  async updateProfile(req: IRequest, res: Response) {
    const user = req.user;

    try {
      const data = await validateSchema(UserUpdateSchema, req.body);
      const updated = await this.userService.updateUser({
        ...data,
        id: user?.id,
      });
      req.flash(
        updated ? "info" : "error",
        updated ? "Account updated successfully" : "Failed to update"
      );
      res.redirect("/profile");
    } catch (error: any) {
      req.flash("error", error.message);
      res.redirect("/profile?updated=0");
    }
  }
}
