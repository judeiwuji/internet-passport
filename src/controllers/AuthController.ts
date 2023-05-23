import { Request, Response } from "express";
import SessionAuth from "../auth/SessionAuth";
import IChangePasswordRequest from "../models/interfaces/IChangePasswordRequest";
import IRequest from "../models/interfaces/IRequest";
import { ChangePasswordSchema } from "../validators/schemas/UserSchema";
import validateSchema from "../validators/validatorSchema";
import LoginSchema from "../validators/schemas/LoginSchema";
import UserService from "../services/UserService";
import { compare } from "bcryptjs";

export default class AuthController {
  private auth = new SessionAuth();
  private userService = new UserService();
  private sessionAuth = new SessionAuth();

  async changePassword(req: IRequest, res: Response) {
    const user = req.user;
    try {
      const data: IChangePasswordRequest = await validateSchema(
        ChangePasswordSchema,
        req.body
      );
      data.userId = user?.id as string;

      const updated = await this.auth.updateUserPassword(data);
      req.flash(
        updated ? "info" : "error",
        updated ? "Password changed successfully" : "Failed to change password"
      );
    } catch (error: any) {
      req.flash("error", error.message);
    }
    res.redirect("/profile");
  }

  async logout(req: Request, res: Response) {
    const session = req.cookies["session"];

    try {
      res.cookie("session", "");
      await this.auth.logout(session);
    } catch (error: any) {
      req.flash("error", error.message);
    }
    res.redirect("/");
  }

  async login(req: Request, res: Response) {
    try {
      const data = await validateSchema(LoginSchema, req.body);
      const user = await this.userService.getUserBy({ email: data.email });
      const isMatch = await compare(data.password, user.password);
      if (!isMatch) {
        throw new Error("Wrong email and password combination");
      }

      if (!user.developer && req.path === "/developer/login") {
        throw new Error("Wrong credentials");
      }

      // if (req.query.clientId) {
      //   // create accessToken and redirect to client
      // }

      const session = await this.sessionAuth.createSession({
        userAgent: req.headers["user-agent"] as string,
        userId: user.id,
      });
      res.cookie("session", session.id, {
        sameSite: true,
        secure: true,
        maxAge: 2.628e9,
      });
      user.developer
        ? res.redirect("/developer/dashboard")
        : res.redirect("/dashboard");
    } catch (error: any) {
      res.render("login", {
        page: {
          title: "Login - Internet Passport",
          description: "Login into your Internet Passport",
        },
        path: req.path,
        error: error.message,
        data: req.body,
      });
    }
  }
}
