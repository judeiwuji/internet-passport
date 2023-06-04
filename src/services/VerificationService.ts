import User from '../models/User';
import JWTUtil from '../utils/JWTUtil';
import crypto from 'crypto';
import MailService from './MailService';

export default class VerificationService {
  mailService = new MailService();

  async sendCode(user: User, code: number) {
    console.log(`\nCode: ${code}\n`);
    return this.mailService.accountVerificationCode(user, code);
  }

  async sendOTP(user: User, code: number) {
    console.log(`\nOTP: ${code}\n`);
    return this.mailService.accountOTP(user, code);
  }

  generateCode() {
    return crypto.randomInt(0, 1000000);
  }

  generateToken(email: string, code: number) {
    return JWTUtil.sign({
      payload: { email, code },
      expiresIn: process.env.VERIFICATION_CODE_EXPIRE,
    });
  }
}
