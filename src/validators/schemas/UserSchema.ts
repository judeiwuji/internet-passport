import { object, ref, string } from "yup";

export const UserCreationSchema = object({
  answer: string().required(),
  question: string().required(),
  confirmPassword: string().oneOf([ref("password")], "Password mismatch"),
  password: string().required(),
  email: string().email().required(),
  lastname: string().required(),
  firstname: string().required(),
});

export const UserUpdateSchema = object({
  firstname: string().optional(),
  lastname: string().optional(),
});

export const UserSecretUpdateSchema = object({
  secretQuestion: string().optional(),
  secretAnswer: string().optional(),
});

export const ChangePasswordSchema = object({
  confirmPassword: string().oneOf([ref("newPassword")], "Password mismatch"),
  newPassword: string().required("Provide your new password"),
  oldPassword: string().required("Provide your old password"),
});
