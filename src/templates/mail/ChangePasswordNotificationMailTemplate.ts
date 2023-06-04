import moment from 'moment';
import AppConfig from '../../config/appConfig';
import User from '../../models/User';
import DeviceDetector from 'node-device-detector';

export default function ChangePasswordNotificationMailTemplate(
  user: User,
  link: string,
  userAgent: string,
  ip: string
) {
  const deviceDetect = new DeviceDetector();
  const device = deviceDetect.detect(userAgent);
  const date = moment().format('LLL');
  return `
  <h1 style="font-weight: 700; font-size: 1.5rem">${AppConfig.appName}</h1>
  <br>
  <p><strong>Hello ${user?.firstname},</strong></p>
  <p>
  We noticed that your passsword was changed using ${device.client.name} 
  on ${device.os.name} from ${ip} at ${date}.
  </p>

  <p>
  If your are not the one that made this change, please click the link below to create a new
  strong password.
  </p>
  <br>
  <a href="${link}">${link}</a>
  <br>
  <p><strong>This link expires in 15 minutes</strong></p> 
  <br>
  <br>
  <p style="text-align: center; font-size: 0.8rem"><strong>${AppConfig.appName}</strong></p>
`;
}
