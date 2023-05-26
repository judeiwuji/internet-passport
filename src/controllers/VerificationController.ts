import { Request, Response } from "express";
import VerificationService from "../services/VerificationService";
import JWTUtil from "../utils/JWTUtils";
import UserService from "../services/UserService";
import SessionAuth from "../auth/SessionAuth";
import AppConfig from "../config/appConfig";

export default class VerificationController {
  private verificationService = new VerificationService();
  private userService = new UserService();
  private auth = new SessionAuth();

  getVerifyEmailPage(req: Request, res: Response) {
    const state = req.query.state as string;
    let isStateValid = true;
    let jwtData;

    try {
      jwtData = JWTUtil.verify({ token: state });
      console.log(jwtData);
    } catch (error) {
      console.log(error);
      isStateValid = false;
    }

    res.render("verifyEmail", {
      page: {
        title: `Verify account email - ${AppConfig.appName}`,
        description: "We use your email to confirm your identity",
      },
      path: req.path,
      isStateValid,
      data: jwtData ? jwtData : {},
      state,
    });
  }

  async verifyEmail(req: Request, res: Response) {
    console.log(req.body);

    try {
      const code = parseInt(req.body["code[]"].join(""));
      const jwtData = JWTUtil.verify({ token: req.body.state });
      console.log(jwtData);
      // compare code
      if (code === jwtData.payload["code"]) {
        req.flash("info", "Account verified");
        const user = await this.userService.findUserBy({
          email: jwtData.email,
        });
        const session = await this.auth.createSession({
          userAgent: req.headers["user-agent"] as string,
          userId: user.id,
        });
        res.cookie("session", session.id);
        user.developer
          ? res.redirect("/developer/dashboard")
          : res.redirect("/dashboard");
      } else {
        req.flash("error", "Invalid verification code");
        res.redirect(`/verifyEmail?state=${req.body.state}`);
      }
    } catch (error: any) {
      console.log(error);
      req.flash("error", error.message);
      res.redirect(`/verifyEmail?state=${req.body.state}`);
    }
  }

  async resendVerificationCode(req: Request, res: Response) {
    const { email } = req.body;
    if (!email) {
      const token = JWTUtil.sign({ payload: { email, codeSent: false } });
      return res.redirect(`/verifyEmail?state=${token}`);
    }

    try {
      const user = await this.userService.findUserBy({ email });
      this.verificationService
        .sendCode(user)
        .then((code) => {
          console.log(code);
          const token = JWTUtil.sign({
            payload: { email: user.email, codeSent: true, code },
            expiresIn: "10m",
          });
          res.redirect(`/verifyEmail?state=${token}`);
        })
        .catch((error) => {
          console.debug(error);
          const token = JWTUtil.sign({
            payload: { email: user.email, codeSent: false },
            expiresIn: "10m",
          });
          res.redirect(`/verifyEmail?state=${token}`);
        });
    } catch (error) {
      const token = JWTUtil.sign({ payload: { email, codeSent: false } });
      return res.redirect(`/verifyEmail?state=${token}`);
    }
  }
}
