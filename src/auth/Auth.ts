import { compare, genSalt, hash } from "bcryptjs";
import IChangePasswordRequest from "../models/interfaces/IChangePasswordRequest";
import UserService from "../services/UserService";
import { PasswordNotMatchError } from "../models/errors/AuthError";

export default abstract class Auth {
  protected userService = new UserService();

  async createAccessToken() {}

  async changePassword(request: IChangePasswordRequest) {
    const user = await this.userService.getUserBy({ id: request.userId });
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
}
