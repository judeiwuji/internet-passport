import { Request, Response } from "express";
import IRequest from "../models/interfaces/IRequest";
import secretQuestions from "../data/secretQuestions";
import validateSchema from "../validators/validatorSchema";
import {
  ChangePasswordSchema,
  UserUpdateSchema,
} from "../validators/schemas/UserSchema";
import UserService from "../services/UserService";
import IChangePasswordRequest from "../models/interfaces/IChangePasswordRequest";
import SessionAuth from "../auth/SessionAuth";

export default class UserController {
  private userService = new UserService();
  private auth = new SessionAuth();

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
    } catch (error: any) {
      req.flash("error", error.message);
    }
    res.redirect("/profile");
  }

  async changePassword(req: IRequest, res: Response) {
    const user = req.user;
    try {
      const data: IChangePasswordRequest = await validateSchema(
        ChangePasswordSchema,
        req.body
      );
      data.userId = user?.id as string;

      const updated = await this.auth.changePassword(data);
      req.flash(
        updated ? "info" : "error",
        updated ? "Password changed successfully" : "Failed to change password"
      );
    } catch (error: any) {
      req.flash("error", error.message);
    }
    res.redirect("/profile");
  }
}
