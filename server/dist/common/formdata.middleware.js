"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormDataMiddleware = void 0;
const multer_1 = __importDefault(require("multer"));
class FormDataMiddleware {
    execute(req, res, next) {
        return (0, multer_1.default)().none;
    }
    ;
}
exports.FormDataMiddleware = FormDataMiddleware;
//# sourceMappingURL=formdata.middleware.js.map