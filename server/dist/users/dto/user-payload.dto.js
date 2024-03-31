"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPayload = void 0;
class UserPayload {
    constructor(model) {
        var _a;
        this.email = model.email;
        this.id = model.id;
        this.isActivated = (_a = model.isActivated) !== null && _a !== void 0 ? _a : false;
    }
}
exports.UserPayload = UserPayload;
//# sourceMappingURL=user-payload.dto.js.map