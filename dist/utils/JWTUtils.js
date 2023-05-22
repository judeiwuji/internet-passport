"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
class JWTUtil {
    static sign(options) {
        const secret = (options.secret || process.env.JWT_SECRET);
        const issuer = options.issuer || process.env.JWT_ISSUER;
        const config = { issuer };
        if (options.expiresIn) {
            config.expiresIn = options.expiresIn;
        }
        return (0, jsonwebtoken_1.sign)(options.payload, secret, config);
    }
    static verify(options) {
        const secret = (options.secret || process.env.JWT_SECRET);
        const issuer = options.issuer || process.env.JWT_ISSUER;
        return (0, jsonwebtoken_1.verify)(options.token, secret, { issuer, complete: true });
    }
    static decode(token) {
        return (0, jsonwebtoken_1.decode)(token, { complete: true, json: true });
    }
}
exports.default = JWTUtil;
//# sourceMappingURL=JWTUtils.js.map