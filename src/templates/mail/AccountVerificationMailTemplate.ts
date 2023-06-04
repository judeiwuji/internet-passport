import AppConfig from '../../config/appConfig';
import User from '../../models/User';

export default function AccountVerificationMailTemplate(
  user: User,
  code: number
) {
  return `
<h1 style="font-weight: 700; font-size: 1.5rem">${AppConfig.appName}</h1>
<br>
<p><strong>Hello ${user?.firstname}</strong></p>
<p>The verification code for your internet passport profile is:</p>
<h1 style="text-align: center">${code}</h1>
<br/>
<p>
  <strong>Note:</strong>
  This verification code will expire after 10 minutes it was generated.
</p>
<br/>
<p>Thanks</p>
<p>Internet Passport Team</p>
`;
}
