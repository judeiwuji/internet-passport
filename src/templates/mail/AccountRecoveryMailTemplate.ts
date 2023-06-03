import AppConfig from '../../config/appConfig';
import User from '../../models/User';

export default function AccountRecoveryMailTemplate(user: User, link: string) {
  return `
    <h1 style="font-weight: 700; font-size: 1.5rem">${AppConfig.appName}</h1>
    <br>
    <br>
    <p>Hi <strong>${user.firstname}</strong>, someone tried to reset your password.
    If you are the one, please click on the link below, else you can ignore this
    mail.</p>
    <br/>
    <br/>
    <a href="${link}">${link}</a>
    <p>
    <strong>Note:</strong>
    This link will expire in 15 minutes.
    </p>
    <br/>
    <br/>
    <p style="text-align: center">
    <strong>${AppConfig.appName}</strong>
    </p>
`;
}
