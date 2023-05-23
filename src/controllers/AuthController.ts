import { Request, Response } from "express";
import SessionAuth from "../auth/SessionAuth";
import IChangePasswordRequest from "../models/interfaces/IChangePasswordRequest";
import IRequest from "../models/interfaces/IRequest";
import { ChangePasswordSchema } from "../validators/schemas/UserSchema";
import validateSchema from "../validators/validatorSchema";

export default class AuthController {
  private auth = new SessionAuth();

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
}
