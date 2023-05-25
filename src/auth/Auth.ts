import { compare, genSalt, hash } from "bcryptjs";
import IChangePasswordRequest from "../models/interfaces/IChangePasswordRequest";
import UserService from "../services/UserService";
import { PasswordNotMatchError } from "../models/errors/AuthError";
import UserDevice from "../models/UserDevice";
import moment from "moment";
import JWTUtil from "../utils/JWTUtils";

export default abstract class Auth {
  protected userService = new UserService();

  createAccessToken(payload: { user: string; client: string }, secret: string) {
    return JWTUtil.sign({
      secret,
      payload,
      expiresIn: process.env["ACCESS_TOKEN_EXPIRE"],
    });
  }

  async updateUserPassword(request: IChangePasswordRequest) {
    const user = await this.userService.findUserBy({ id: request.userId });
    const isMatch = await compare(request.oldPassword, user.password);
    if (!isMatch) {
      throw new PasswordNotMatchError(
        "Old password does not match your current password"
      );
    }
    const salt = await genSalt(12);
    const passwordHash = await hash(request.newPassword, salt);
    return this.userService.changePassword(passwordHash, user.id);
  }

  async requireMFA(userId: string, userAgent: string) {
    const device = await UserDevice.findOne({ where: { userId, userAgent } });
    if (!device) {
      return true;
    }

    const now = moment();
    const months = now.diff(moment(device.createdAt), "month");
    return months >= 1;
  }

  createIdentityToken(userId: string) {
    return JWTUtil.sign({
      payload: {
        user: userId,
      },
      expiresIn: process.env["AUTH_CHALLENGE_EXPIRE"],
    });
  }
}
