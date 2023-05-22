"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSecretUpdateSchema = exports.UserUpdateSchema = exports.UserCreationSchema = void 0;
const yup_1 = require("yup");
exports.UserCreationSchema = (0, yup_1.object)({
    answer: (0, yup_1.string)().required(),
    question: (0, yup_1.string)().required(),
    confirmPassword: (0, yup_1.string)().oneOf([(0, yup_1.ref)("password")], "Password mismatch"),
    password: (0, yup_1.string)().required(),
    email: (0, yup_1.string)().email().required(),
    lastname: (0, yup_1.string)().required(),
    firstname: (0, yup_1.string)().required(),
});
exports.UserUpdateSchema = (0, yup_1.object)({
    firstname: (0, yup_1.string)().optional(),
    lastname: (0, yup_1.string)().optional(),
    id: (0, yup_1.string)().required(),
});
exports.UserSecretUpdateSchema = (0, yup_1.object)({
    secretQuestion: (0, yup_1.string)().optional(),
    secretAnswer: (0, yup_1.string)().optional(),
});
//# sourceMappingURL=UserSchema.js.map