"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseError extends Error {
    constructor(code, message) {
        super(message);
        this.code = code;
    }
}
exports.default = BaseError;
//# sourceMappingURL=BaseError.js.map