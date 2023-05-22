import User, { UserAttributes, UserCreationAttributes } from "../models/User";
import { genSalt, hash } from "bcryptjs";
import {
  UserAlreadyExistsError,
  UserCreateError,
  UserNotFoundError,
} from "../models/errors/UserError";
import UserSecret, { UserSecretCreationAttributes } from "../models/UserSecret";
import DB from "../models/engine/DBStorage";

export default class UserService {
  async createUser(
    data: UserCreationAttributes & UserSecretCreationAttributes
  ) {
    const transaction = await DB.transaction();
    try {
      const emailExists = await User.findOne({ where: { email: data.email } });
      if (emailExists) {
        throw new UserAlreadyExistsError(`${data.email} already exists`);
      }

      const salt = await genSalt(12);
      const hashedPassword = await hash(data.password, salt);
      const hashedSecretAnswer = await hash(data.answer, salt);
      const { id } = await User.create(
        {
          email: data.email,
          firstname: data.firstname.toLowerCase(),
          lastname: data.lastname.toLowerCase(),
          password: hashedPassword,
        },
        { transaction }
      );

      await UserSecret.create(
        {
          answer: hashedSecretAnswer,
          question: data.question,
          userId: id,
        },
        { transaction }
      );
      await transaction.commit();
      return (await User.findByPk(id)) as User;
    } catch (error) {
      await transaction.rollback();
      console.debug(error);
      throw new UserCreateError("Server was unable to process your request.");
    }
  }

  async getUserBy(query: any) {
    const user = await User.findOne({ where: query });
    if (user === null) {
      throw new UserNotFoundError("No user found");
    }
    return user;
  }

  async updateUser(data: UserAttributes) {
    if ((await User.findByPk(data.id)) === null) {
      throw new UserNotFoundError("No user found");
    }
    const [affectedRows] = await User.update(
      {
        firstname: data.firstname,
        lastname: data.lastname,
      },
      { where: { id: data.id } }
    );

    return affectedRows > 0;
  }

  async deleteUser(id: string) {
    if ((await User.findByPk(id)) === null) {
      throw new UserNotFoundError("No user found");
    }
    const result = await User.destroy({ where: { id } });

    return result > 0;
  }
}
