"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserNotFoundError = exports.UserAlreadyExistsError = exports.UserCreateError = void 0;
const BaseError_1 = __importDefault(require("./BaseError"));
class UserCreateError extends BaseError_1.default {
    constructor(message) {
        super("UserCreationFailed", message);
    }
}
exports.UserCreateError = UserCreateError;
class UserAlreadyExistsError extends BaseError_1.default {
    constructor(message) {
        super("UserAlreadyExists", message);
    }
}
exports.UserAlreadyExistsError = UserAlreadyExistsError;
class UserNotFoundError extends BaseError_1.default {
    constructor(message) {
        super("UserNotFound", message);
    }
}
exports.UserNotFoundError = UserNotFoundError;
//# sourceMappingURL=UserError.js.map