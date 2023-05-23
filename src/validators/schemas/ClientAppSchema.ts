import { object, string } from "yup";

export const ClientAppCreationSchema = object({
  redirectURL: string().required("Provide redirect URL"),
  name: string().required("Provide app name"),
});

export const ClientAppUpdatechema = object({
  redirectURL: string().optional(),
  name: string().optional(),
  id: string().required("Missing App id"),
});
