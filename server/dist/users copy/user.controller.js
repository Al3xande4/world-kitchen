"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const base_controller_1 = require("../common/base.controller");
const inversify_1 = require("inversify");
require("reflect-metadata");
const types_1 = require("../types");
const user_register_dto_1 = require("./dto/user-register.dto");
const jsonwebtoken_1 = require("jsonwebtoken");
const http_error_1 = require("../errors/http-error");
const user_login_dto_1 = require("./dto/user-login.dto");
const validate_middleware_1 = require("../common/validate.middleware");
const auth_guard_1 = require("../common/auth.guard");
let UserController = class UserController extends base_controller_1.BaseController {
    constructor(loggerService, userService, configService) {
        super(loggerService);
        this.loggerService = loggerService;
        this.userService = userService;
        this.configService = configService;
        this.bindRoutes([
            {
                path: '/register',
                func: this.register,
                method: 'post',
                middlewares: [new validate_middleware_1.ValidateMiddleware(user_register_dto_1.UserRegisterDto)],
            },
            {
                path: '/login',
                func: this.login,
                method: 'post',
                middlewares: [new validate_middleware_1.ValidateMiddleware(user_login_dto_1.UserLoginDto)],
            },
            {
                path: '/secret',
                func: this.secret,
                method: 'get',
                middlewares: [new auth_guard_1.AuthGuard()],
            },
            {
                path: '/',
                func: this.users,
                method: 'get',
                middlewares: [],
            },
        ]);
    }
    register(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            this.loggerService.info(req.body);
            const result = yield this.userService.createUser(req.body);
            if (!result) {
                return next(new http_error_1.HttpExeption('User already exists error', 422));
            }
            const token = yield this.signJWT(req.body.username, this.configService.get('ACCESS_TOKEN'));
            this.ok(res, { jwt: token });
        });
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.userService.validateUser(req.body);
            if (!result) {
                return next(new http_error_1.HttpExeption('Auth error', 401));
            }
            const token = yield this.signJWT(req.body.username, this.configService.get('ACCESS_TOKEN'));
            this.ok(res, { jwt: token });
        });
    }
    secret(req, res, next) {
        this.ok(res, { user: req.user });
        next();
    }
    users(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            this.ok(res, yield this.userService.getAll());
            next();
        });
    }
    signJWT(name, secret) {
        return new Promise((resolve, reject) => {
            (0, jsonwebtoken_1.sign)({ username: name, iat: Math.floor(Date.now() / 999) }, secret, {
                algorithm: 'HS256',
            }, (err, token) => {
                if (err) {
                    reject(err);
                }
                resolve(token);
            });
        });
    }
};
UserController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.Logger)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.UserService)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.ConfigService)),
    __metadata("design:paramtypes", [Object, Object, Object])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map