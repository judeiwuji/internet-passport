import AppConfig from '../config/appConfig';
import User from '../models/User';
import AccountRecoveryMailTemplate from '../templates/mail/AccountRecoveryMailTemplate';
import AccountVerificationMailTemplate from '../templates/mail/AccountVerificationMailTemplate';
import ChangePasswordNotificationMailTemplate from '../templates/mail/ChangePasswordNotificationMailTemplate';
import LoginNotificationMailTemplate from '../templates/mail/LoginNotificationMailTemplate';
import NodemailerUtils from '../utils/NodemailerUtils';

export default class MailService {
  mailer = new NodemailerUtils();

  async accountRecovery(user: User, link: string) {
    return this.mailer.send({
      html: AccountRecoveryMailTemplate(user, link),
      to: user.email,
      subject: `${AppConfig.appName} Account Recovery`,
    });
  }

  async accountVerificationCode(user: User, code: number) {
    return this.mailer.send({
      html: AccountVerificationMailTemplate(user, code),
      to: user.email,
      subject: `${AppConfig.appName} Verification Code`,
    });
  }

  async loginNotification(
    user: User,
    link: string,
    userAgent: string,
    ip: string
  ) {
    return this.mailer.send({
      html: LoginNotificationMailTemplate(user, link, userAgent, ip),
      to: user.email,
      subject: `New Login - ${AppConfig.appName}`,
    });
  }

  async changePasswordNotification(
    user: User,
    link: string,
    userAgent: string,
    ip: string
  ) {
    return this.mailer.send({
      html: ChangePasswordNotificationMailTemplate(user, link, userAgent, ip),
      to: user.email,
      subject: `New Login - ${AppConfig.appName}`,
    });
  }
}
