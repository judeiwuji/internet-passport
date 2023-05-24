import { Request, Response } from "express";
import IRequest from "../models/interfaces/IRequest";
import secretQuestions from "../data/secretQuestions";
import validateSchema from "../validators/validatorSchema";
import {
  ChangePasswordSchema,
  UserSecretUpdateSchema,
  UserUpdateSchema,
} from "../validators/schemas/UserSchema";
import UserService from "../services/UserService";
import SessionAuth from "../auth/SessionAuth";

export default class UserController {
  private userService = new UserService();

  getDashboard(req: IRequest, res: Response) {
    if (req.user && req.user.developer) {
      res.redirect("/developer/dashboard");
    }
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
    } catch (error: any) {
      req.flash("error", error.message);
    }
    res.redirect("/profile");
  }

  async updateSecret(req: IRequest, res: Response) {
    const user = req.user;
    try {
      const data = await validateSchema(UserSecretUpdateSchema, req.body);
      data.userId = user?.id as string;

      const updated = await this.userService.updateUserSecret(data);
      req.flash(
        updated ? "info" : "error",
        updated ? "Secret updated successfully" : "Failed to update secret"
      );
    } catch (error: any) {
      req.flash("error", error.message);
    }
    res.redirect("/profile");
  }
}
