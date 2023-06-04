import { object, ref, string } from 'yup';

export const IdentityChallengeSchema = object({
  state: string().required('Missing credentials'),
  answer: string().required('Missing answer'),
  question: string().required('Missing question'),
});

export const AppConsentSchema = object({
  client: string().required('Missing credentials'),
  state: string().required('Missing credentials'),
});

export const ResetPasswordSchema = object({
  state: string().required('Missing credentials'),
  confirmPassword: string().oneOf([ref('newPassword')], 'Password mismatch'),
  newPassword: string().required('Provide new password'),
});
