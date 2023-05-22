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
  id: string().required(),
});

export const UserSecretUpdateSchema = object({
  secretQuestion: string().optional(),
  secretAnswer: string().optional(),
});
