import { Router } from 'express';
import VerificationController from '../controllers/VerificationController';

const verificationRouter = Router();
const verificationController = new VerificationController();

verificationRouter.get('/verifyEmail', (req, res) =>
  verificationController.getVerifyEmailPage(req, res)
);

verificationRouter.post('/verifyEmail', (req, res) =>
  verificationController.verifyEmail(req, res)
);

verificationRouter.post('/resend/verificationCode', (req, res) =>
  verificationController.resendVerificationCode(req, res)
);

verificationRouter.get('/verifyOTP', (req, res) =>
  verificationController.getOTPPage(req, res)
);

verificationRouter.post('/verifyOTP', (req, res) =>
  verificationController.verifyOTP(req, res)
);

verificationRouter.post('/resend/otp', (req, res) =>
  verificationController.resendOTP(req, res)
);
export default verificationRouter;
