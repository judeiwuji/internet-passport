import { object, string } from "yup";

export const IdentityChallengeSchema = object({
  state: string().required("State is missing"),
  answer: string().required("Wrong identity combination"),
  question: string().required("Missing credentials"),
});
