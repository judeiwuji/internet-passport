"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../models/User"));
const bcryptjs_1 = require("bcryptjs");
const UserError_1 = require("../models/errors/UserError");
const UserSecret_1 = __importDefault(require("../models/UserSecret"));
const DBStorage_1 = __importDefault(require("../models/engine/DBStorage"));
class UserService {
    createUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield DBStorage_1.default.transaction();
            try {
                const emailExists = yield User_1.default.findOne({ where: { email: data.email } });
                if (emailExists) {
                    throw new UserError_1.UserAlreadyExistsError(`${data.email} already exists`);
                }
                const salt = yield (0, bcryptjs_1.genSalt)(12);
                const hashedPassword = yield (0, bcryptjs_1.hash)(data.password, salt);
                const hashedSecretAnswer = yield (0, bcryptjs_1.hash)(data.answer, salt);
                const { id } = yield User_1.default.create({
                    email: data.email,
                    firstname: data.firstname.toLowerCase(),
                    lastname: data.lastname.toLowerCase(),
                    password: hashedPassword,
                }, { transaction });
                yield UserSecret_1.default.create({
                    answer: hashedSecretAnswer,
                    question: data.question,
                    userId: id,
                }, { transaction });
                yield transaction.commit();
                return (yield User_1.default.findByPk(id));
            }
            catch (error) {
                yield transaction.rollback();
                console.debug(error);
                throw new UserError_1.UserCreateError("Server was unable to process your request.");
            }
        });
    }
    getUserBy(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.default.findOne({ where: query });
            if (user === null) {
                throw new UserError_1.UserNotFoundError("No user found");
            }
            return user;
        });
    }
    updateUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((yield User_1.default.findByPk(data.id)) === null) {
                throw new UserError_1.UserNotFoundError("No user found");
            }
            const [affectedRows] = yield User_1.default.update({
                firstname: data.firstname,
                lastname: data.lastname,
            }, { where: { id: data.id } });
            return affectedRows > 0;
        });
    }
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((yield User_1.default.findByPk(id)) === null) {
                throw new UserError_1.UserNotFoundError("No user found");
            }
            const result = yield User_1.default.destroy({ where: { id } });
            return result > 0;
        });
    }
}
exports.default = UserService;
//# sourceMappingURL=UserService.js.map