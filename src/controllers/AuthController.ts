import { Request, Response } from 'express';
import SessionAuth from '../auth/SessionAuth';
import IChangePasswordRequest from '../models/interfaces/IChangePasswordRequest';
import IRequest from '../models/interfaces/IRequest';
import { ChangePasswordSchema } from '../validators/schemas/UserSchema';
import validateSchema from '../validators/validatorSchema';
import LoginSchema from '../validators/schemas/LoginSchema';
import UserService from '../services/UserService';
import { compare } from 'bcryptjs';
import JWTUtil from '../utils/JWTUtil';
import secretQuestions from '../data/secretQuestions';
import {
  AppConsentSchema,
  IdentityChallengeSchema,
  ResetPasswordSchema,
} from '../validators/schemas/AuthSchema';
import { UnknownUserError } from '../models/errors/AuthError';
import UserSecret from '../models/UserSecret';
import UserApp from '../models/UserApp';
import ClientApp from '../models/ClientApp';
import UserDevice from '../models/UserDevice';
import ClientAppService from '../services/ClientAppService';
import User from '../models/User';
import AppConfig from '../config/appConfig';
import toQueryParamString from '../helpers/toQueryParamString';
import { config } from 'dotenv';
import MailService from '../services/MailService';
import getIPAddress from '../helpers/getIPAddress';
import VerificationService from '../services/VerificationService';
config();

export default class AuthController {
  private auth = new SessionAuth();
  private userService = new UserService();
  private clientAppService = new ClientAppService();
  private mailService = new MailService();
  private verificationService = new VerificationService();

  async changePassword(req: IRequest, res: Response) {
    const user = req.user;
    try {
      const data: IChangePasswordRequest = await validateSchema(
        ChangePasswordSchema,
        req.body
      );
      data.userId = user?.id as string;

      const updated = await this.auth.updateUserPassword(data);
      const link = this.auth.generateRecoveryLink(req, user as User);
      this.mailService.changePasswordNotification(
        user as User,
        link,
        req.headers['user-agent'] as string,
        getIPAddress(req) as string
      );
      req.flash(
        updated ? 'info' : 'error',
        updated ? 'Password changed successfully' : 'Failed to change password'
      );
    } catch (error: any) {
      req.flash('error', error.message);
    }
    req.user?.developer
      ? res.redirect('/developer/profile')
      : res.redirect('/profile');
  }

  async logout(req: Request, res: Response) {
    const session = req.cookies['session'];

    try {
      res.clearCookie('session');
      await this.auth.logout(session);
    } catch (error: any) {
      req.flash('error', error.message);
    }
    res.redirect('/');
  }

  async login(req: Request, res: Response) {
    try {
      const data = await validateSchema(LoginSchema, req.body);
      const user = await this.userService.findUserBy({ email: data.email });
      const isMatch = await compare(data.password, user.password);
      if (!isMatch) {
        throw new Error('Wrong email and password combination');
      }
      // login notification
      const link = this.auth.generateRecoveryLink(req, user);
      this.mailService.loginNotification(
        user,
        link,
        req.headers['user-agent'] as string,
        getIPAddress(req) as string
      );

      // update last login
      await this.userService.updateDevice(
        user,
        req.headers['user-agent'] as string
      );

      const canCompleteMFA = await this.auth.requireMFA(
        user.id,
        req.headers['user-agent'] as string
      );
      const identityToken = this.auth.createIdentityToken(user.id);

      if (canCompleteMFA) {
        if (user.developer) {
          const code = this.verificationService.generateCode();
          const token = this.verificationService.generateToken(
            user.email,
            code
          );
          this.verificationService.sendOTP(user, code);
          res.redirect(
            `/verifyOTP${toQueryParamString({
              state: token,
              client: req.query.client,
            })}`
          );
          return;
        } else {
          res.redirect(
            `/login/auth/identity/challenge${toQueryParamString({
              state: identityToken,
              client: req.query.client,
            })}`
          );
          return;
        }
      }

      if (!user.developer && req.query.client) {
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
      res.cookie('session', session.id, {
        sameSite: 'strict',
        secure: true,
        maxAge: 2.628e9,
      });
      user.developer
        ? res.redirect('/developer/dashboard')
        : res.redirect('/dashboard');
    } catch (error: any) {
      req.flash('error', error.message);
      res.redirect(`back`);
    }
  }

  async getIdentityChallengePage(req: Request, res: Response) {
    const { state, client } = req.query;
    let isValidSession = true;
    try {
      JWTUtil.verify({
        token: state as string,
      });
    } catch (error: any) {
      isValidSession = false;
    }
    res.render('challenge', {
      page: {
        title: `Identity Challenge - ${AppConfig.appName}`,
        description: 'MFA challenge',
      },
      questions: secretQuestions,
      isValidSession,
      state,
      client,
      appName: AppConfig.appName,
    });
  }

  async processIdentityChallenge(req: Request, res: Response) {
    const { state, client } = req.body;

    try {
      const data = await validateSchema(IdentityChallengeSchema, req.body);
      const jwtData = JWTUtil.verify({
        token: data.state,
      });
      const userId = jwtData.user;
      const user = await this.userService.findUserBy({ id: userId });
      const userSecret = await this.userService.findSecretBy({
        userId,
        question: data.question,
      });

      const isMatch = await compare(data.answer, userSecret.answer);
      if (!isMatch) {
        throw new Error('Wrong secret combinantion');
      }

      // create sesssion and redirect to dashboard
      await this.userService.addDevice(
        user,
        req.headers['user-agent'] as string
      );

      if (client) {
        const userApp = await UserApp.findOne({
          where: {
            id: client,
            userId,
          },
          include: [ClientApp],
        });

        if (!userApp) {
          // redirect to consent page
          return res.redirect(
            `/login/auth/consent/?state=${state}&client=${client}`
          );
        }

        // create access token and redirect to client url
        const accessToken = this.auth.createAccessToken(
          {
            user: jwtData.user,
            client,
          },
          userApp?.client.secret as string
        );
        return res.redirect(
          `${userApp?.client.redirectURL}?code=${accessToken}`
        );
      }

      const session = await this.auth.createSession({
        userAgent: req.headers['user-agent'] as string,
        userId,
      });

      res.cookie('session', session.id, {
        sameSite: true,
        secure: true,
        maxAge: 2.628e9,
      });
      res.redirect('/dashboard');
    } catch (error: any) {
      req.flash('error', error.message);
      res.redirect(
        `/login/auth/identity/challenge${toQueryParamString({
          state,
          client,
        })}`
      );
    }
  }

  async getUserAppConsentPage(req: Request, res: Response) {
    const { state, client } = req.query;
    let app: ClientApp | null = null;
    let isValidSession = true;

    try {
      app = await this.clientAppService.findAppBy({ id: client });
      const jwtData = JWTUtil.verify({ token: state as string });
      const userApp = await this.userService.findAppBy({
        userId: jwtData.user,
        clientId: client,
      });

      // App allowed by user
      if (userApp) {
        const accessToken = this.auth.createAccessToken(
          { user: jwtData.user, client: app.id },
          app.secret
        );
        return res.redirect(`${app.redirectURL}?code=${accessToken}`);
      }
    } catch (error) {
      isValidSession = false;
    }

    res.render('consent', {
      page: {
        title: `Consent - ${AppConfig.appName}`,
        description: 'Allow app to get your public profile',
      },
      isValidSession,
      app: app?.toJSON(),
      client: req.query.client,
      state: req.query.state,
      appName: AppConfig.appName,
    });
  }

  async processUserAppConsent(req: Request, res: Response) {
    try {
      const jwtData = JWTUtil.verify({ token: req.body.state });
      const app = await this.clientAppService.findAppBy({
        id: req.body.client,
      });
      await validateSchema(AppConsentSchema, req.body);

      await UserApp.create({
        userId: jwtData.user,
        clientId: app.id,
      });
      const accessToken = this.auth.createAccessToken(
        {
          user: jwtData.user,
          client: app.id,
        },
        app.secret
      );

      res.redirect(`${app.redirectURL}?code=${accessToken}`);
    } catch (error: any) {
      req.flash('error', error.message);
      res.redirect(`/login/auth/consent${toQueryParamString(req.query)}`);
    }
  }

  async getRecoverAccountIdentityPage(req: Request, res: Response) {
    res.render('recoverAccount', {
      page: {
        title: `Recover account - ${AppConfig.appName}`,
        description: 'Account recovery',
      },
    });
  }

  async recoverAccountIdentity(req: Request, res: Response) {
    try {
      const { email } = req.body;
      if (!email) {
        throw new Error('Provide your account email');
      }
      const user = await this.userService.findUserBy({ email });

      if (user.developer) {
        const link = this.auth.generateRecoveryLink(req, user);
        this.mailService.accountRecovery(user, link);
        req.flash(
          'info',
          'An account recovery email has been sent to your email'
        );
        return res.redirect('/login/auth/recoverAccount/identity');
      } else {
        const token = this.auth.createIdentityToken(user.id);
        res.redirect(`/login/auth/recoverAccount/challenge?state=${token}`);
      }
    } catch (error: any) {
      req.flash('error', error.message);
      res.redirect('back');
    }
  }

  async getRecoverAccountChallengePage(req: Request, res: Response) {
    let isValidSession = true;
    try {
      JWTUtil.verify({ token: req.query.state as string });
    } catch (error) {
      isValidSession = false;
    }
    res.render('challenge', {
      page: {
        title: `Recover account challenge - ${AppConfig.appName}`,
        description: 'Account recovery challenge',
      },
      isValidSession,
      questions: secretQuestions,
      state: req.query.state,
      client: req.query.client,
    });
  }

  async recoverAccountChallenge(req: IRequest, res: Response) {
    try {
      const data = await validateSchema(IdentityChallengeSchema, req.body);
      const jwtData = JWTUtil.verify({ token: data.state });
      const user = await this.userService.findUserBy({ id: jwtData.user });
      const secret = await this.userService.findSecretBy({
        userId: jwtData.user,
        question: data.question,
      });
      const isMatch = await compare(data.answer, secret.answer);

      if (!isMatch) {
        throw new UnknownUserError('Wrong secret combination');
      }
      const link = this.auth.generateRecoveryLink(req, user);
      this.mailService.accountRecovery(user, link);
      req.flash(
        'info',
        'An account recovery email has been sent to your email'
      );
      res.redirect('/login/auth/recoverAccount/identity');
    } catch (error: any) {
      req.flash('error', error.message);
      res.redirect(
        `/login/auth/recoverAccount/challenge${toQueryParamString({
          state: req.body.state,
          client: req.body.client,
        })}`
      );
    }
  }

  async getResetPasswordPage(req: Request, res: Response) {
    let isValidSession = true;
    let user: any;
    try {
      const jwtData = JWTUtil.verify({ token: req.query.token as string });
      user = (await this.userService.findUserBy({ id: jwtData.user })).toJSON();
    } catch (error) {
      isValidSession = false;
    }
    res.render('resetPassword', {
      page: {
        title: `Reset account password - ${AppConfig.appName}`,
        description: 'Reset account password',
      },
      isValidSession,
      state: req.query.token,
      client: req.query.client,
      user,
    });
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const data = await validateSchema(ResetPasswordSchema, req.body);
      const { user } = JWTUtil.verify({ token: req.body.state });
      this.auth.resetPassword({
        userId: user,
        newPassword: data.newPassword,
      });
      req.flash('info', 'Password reset successfully');
      res.redirect(
        `/login${toQueryParamString({
          client: req.body.client,
        })}`
      );
    } catch (error: any) {
      req.flash('error', error.message);
      res.redirect('back');
    }
  }
}
