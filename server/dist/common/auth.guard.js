"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthGuard = void 0;
const http_error_1 = require("../errors/http-error");
class AuthGuard {
    execute(req, res, next) {
        if (req.userPayload) {
            return next();
        }
        next(new http_error_1.HttpExeption('You are not authorized', 401));
    }
}
exports.AuthGuard = AuthGuard;
//# sourceMappingURL=auth.guard.js.map