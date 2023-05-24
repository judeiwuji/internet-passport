import User, { UserAttributes, UserCreationAttributes } from "../models/User";
import { genSalt, hash } from "bcryptjs";
import {
  UserAlreadyExistsError,
  UserCreateError,
  UserNotFoundError,
} from "../models/errors/UserError";
import UserSecret, {
  UserSecretAttributes,
  UserSecretCreationAttributes,
} from "../models/UserSecret";
import DB from "../models/engine/DBStorage";
import Developer from "../models/Developer";
import UserApp from "../models/UserApp";
import UserDevice from "../models/UserDevice";
import DeviceDetector from "node-device-detector";

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

  async findUserBy(query: any) {
    const user = await User.findOne({
      where: query,
      include: [Developer, UserSecret],
    });
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

  async changePassword(hashedPassword: string, id: string) {
    const [affectedRows] = await User.update(
      {
        password: hashedPassword,
      },
      { where: { id } }
    );

    return affectedRows > 0;
  }

  async updateUserSecret(data: UserSecretAttributes) {
    const salt = await genSalt(12);
    const hashedSecretAnswer = await hash(data.answer, salt);
    const [affectedRows] = await UserSecret.update(
      {
        question: data.question,
        answer: hashedSecretAnswer,
      },
      { where: { userId: data.userId } }
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

  async getDevices(userId: string) {
    const detector = new DeviceDetector();

    const devices = await UserDevice.findAll({ where: { userId } });
    return devices.map((d) => {
      const data = detector.detect(d.userAgent);
      console.log(data);
      return {
        ...d.toJSON(),
        data,
      };
    });
  }

  async getApps(userId: string) {
    const apps = await UserApp.findAll({ where: { userId } });
    return apps.map((d) => d.toJSON());
  }
}
