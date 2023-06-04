import DeviceDetector from 'node-device-detector';
import AppConfig from '../../config/appConfig';
import User from '../../models/User';
import moment from 'moment';

export default function LoginNotificationMailTemplate(
  user: User,
  link: string,
  userAgent: string,
  ip: string
) {
  const deviceDetect = new DeviceDetector();
  const device = deviceDetect.detect(userAgent);
  const date = moment().format('LLL');
  return `<h1 style="font-weight: 700; font-size: 1.5rem">${AppConfig.appName}</h1>
<br>
<p><strong>Hello ${user?.firstname},</strong></p>
<p>
We noticed a new login to your account using 
${device.client.name} on ${device.os.name} from ${ip} at ${date}
</p>
<p>
If you logged in recently, no need to worry and you can disregard this message.
</p>

<p>
If that wasn't you or you don't recognize this login, we strongly recommend that you change your password
as soon as possible using the link below.
</p>
<br/>
<br/>
<a href="${link}">${link}</a>
<p>
<strong>This link will expire in 15 minutes.</strong>
</p>
<br/>
<br/>
<p style="text-align: center">
<strong>${AppConfig.appName}</strong>
</p>`;
}
