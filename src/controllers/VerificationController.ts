import { Request, Response } from 'express';
import VerificationService from '../services/VerificationService';
import JWTUtil from '../utils/JWTUtil';
import UserService from '../services/UserService';
import SessionAuth from '../auth/SessionAuth';
import AppConfig from '../config/appConfig';
import toQueryParamString from '../helpers/toQueryParamString';

export default class VerificationController {
  private verificationService = new VerificationService();
  private userService = new UserService();
  private auth = new SessionAuth();

  getVerifyEmailPage(req: Request, res: Response) {
    const state = req.query.state as string;
    let isStateValid = true;
    let jwtData: any = {};

    try {
      jwtData = JWTUtil.verify({ token: state });
    } catch (error) {
      console.log(error);
      isStateValid = false;
    }

    res.render('verifyEmail', {
      page: {
        title: `Verify account email - ${AppConfig.appName}`,
        description: 'We use your email to confirm your identity',
      },
      path: req.path,
      isStateValid,
      data: jwtData ? jwtData : {},
      state,
      email: jwtData.email,
    });
  }

  async verifyEmail(req: Request, res: Response) {
    try {
      const code = parseInt(req.body['codes'].join(''));
      const jwtData = JWTUtil.verify({ token: req.body.state });

      // compare code
      if (code === jwtData['code']) {
        req.flash('info', 'Account verified');
        const user = await this.userService.findUserBy({
          email: jwtData.email,
        });
        await user.set('verified', true).save();
        this.userService.addDevice(user, req.headers['user-agent'] as string);

        if (req.query.client) {
          const identityToken = this.auth.createIdentityToken(user.id);
          res.redirect(
            `/login/auth/consent${toQueryParamString({
              state: identityToken,
              client: req.query.client,
            })}`
          );
          return;
        }
        const session = await this.auth.createSession({
          userAgent: req.headers['user-agent'] as string,
          userId: user.id,
        });
        res.cookie('session', session.id);
        user.developer
          ? res.redirect('/developer/dashboard')
          : res.redirect('/dashboard');
      } else {
        req.flash('error', 'Invalid verification code');
        res.redirect(`/verifyEmail?state=${req.body.state}`);
      }
    } catch (error: any) {
      console.log(error);
      req.flash('error', error.message);
      res.redirect(`/verifyEmail?state=${req.body.state}`);
    }
  }

  async resendVerificationCode(req: Request, res: Response) {
    const { email, client } = req.body;
    if (!email) {
      req.flash('error', 'Invalid verification link');
      res.redirect(`/login${toQueryParamString({ client })}`);
      return;
    }

    const user = await this.userService.findUserBy({ email });
    const code = this.verificationService.generateCode();
    const token = this.verificationService.generateToken(email, code);

    this.verificationService.sendCode(user, code);
    res.redirect(`/verifyEmail?${toQueryParamString({ token, client })}`);
  }

  getOTPPage(req: Request, res: Response) {
    const state = req.query.state as string;
    let isStateValid = true;
    let jwtData: any = {};

    try {
      jwtData = JWTUtil.verify({ token: state });
    } catch (error) {
      console.log(error);
      isStateValid = false;
    }

    res.render('verifyOTP', {
      page: {
        title: `OTP - ${AppConfig.appName}`,
        description:
          'As a process to secure your account we use OTP for enhanced security',
      },
      path: req.path,
      isStateValid,
      data: jwtData ? jwtData : {},
      state,
      email: jwtData.email,
    });
  }

  async verifyOTP(req: Request, res: Response) {
    try {
      const code = parseInt(req.body['codes'].join(''));
      const jwtData = JWTUtil.verify({ token: req.body.state });

      // compare code
      if (code === jwtData['code']) {
        const user = await this.userService.findUserBy({
          email: jwtData.email,
        });
        this.userService.addDevice(user, req.headers['user-agent'] as string);

        const session = await this.auth.createSession({
          userAgent: req.headers['user-agent'] as string,
          userId: user.id,
        });
        res.cookie('session', session.id);
        user.developer
          ? res.redirect('/developer/dashboard')
          : res.redirect('/dashboard');
      } else {
        req.flash('error', 'Invalid OTP');
        res.redirect(`/verifyOTP?state=${req.body.state}`);
      }
    } catch (error: any) {
      console.log(error);
      req.flash('error', error.message);
      res.redirect(`/verifyOTP?state=${req.body.state}`);
    }
  }

  async resendOTP(req: Request, res: Response) {
    const { email, client } = req.body;
    if (!email) {
      req.flash('error', 'Broken or expired session');
      res.redirect(`/login${toQueryParamString({ client })}`);
      return;
    }

    const user = await this.userService.findUserBy({ email });
    const code = this.verificationService.generateCode();
    const token = this.verificationService.generateToken(email, code);

    this.verificationService.sendOTP(user, code);
    res.redirect(`/verifyOTP${toQueryParamString({ token, client })}`);
  }
}
