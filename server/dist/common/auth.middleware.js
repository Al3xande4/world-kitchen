"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
class AuthMiddleware {
    constructor(accessToken) {
        this.accessToken = accessToken;
    }
    execute(req, res, next) {
        if (!req.headers.authorization) {
            return next();
        }
        (0, jsonwebtoken_1.verify)(req.headers.authorization.split(' ')[1], this.accessToken, (err, payload) => {
            if (err) {
                next();
            }
            else if (payload) {
                req.userPayload = payload;
                next();
            }
        });
    }
}
exports.AuthMiddleware = AuthMiddleware;
//# sourceMappingURL=auth.middleware.js.map