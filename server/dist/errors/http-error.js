"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpExeption = void 0;
class HttpExeption extends Error {
    constructor(message, statusCode, context) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.context = context;
    }
}
exports.HttpExeption = HttpExeption;
//# sourceMappingURL=http-error.js.map