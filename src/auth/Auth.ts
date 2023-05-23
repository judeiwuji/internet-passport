import Session, { SessionCreationAttributes } from "../models/Session";

export default abstract class Auth {
  async createSession(data: SessionCreationAttributes) {
    return Session.create(data);
  }

  async createAccessToken() {}
}
