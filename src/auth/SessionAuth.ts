import Session from "../models/Session";
import User from "../models/User";
import UserSecret from "../models/UserSecret";
import { SessionNotFoundError } from "../models/errors/SessionError";
import Auth from "./Auth";

export default class SessionAuth extends Auth {
  async findUserBySession(sessionId: string) {
    const session = await Session.findByPk(sessionId, {
      include: [{ model: User, include: [UserSecret] }],
    });

    if (!session) {
      throw new SessionNotFoundError("Not found");
    }
    return session.user;
  }
}
