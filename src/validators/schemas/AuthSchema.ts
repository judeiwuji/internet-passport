import { boolean, object, string } from "yup";

export const IdentityChallengeSchema = object({
  state: string().required("State is missing"),
  answer: string().required("Wrong identity combination"),
  question: string().required("Missing credentials"),
});

export const AppConsentSchema = object({
  client: string().required("Missing credentials"),
  state: string().required("Missing credentials"),
});