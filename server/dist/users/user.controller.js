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
const user_restore_dto_1 = require("./dto/user-restore.dto");
const user_reset_dto_1 = require("./dto/user-reset.dto");
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
                middlewares: [
                    new validate_middleware_1.ValidateMiddleware(user_register_dto_1.UserRegisterDto, 'Incorrect email or password'),
                ],
            },
            {
                path: '/recipes',
                func: this.userRecipes,
                method: 'get',
                middlewares: [new auth_guard_1.AuthGuard()],
            },
            {
                path: '/login',
                func: this.login,
                method: 'post',
                middlewares: [
                    new validate_middleware_1.ValidateMiddleware(user_login_dto_1.UserLoginDto, 'Incorrect email or password.'),
                ],
            },
            {
                path: '/restore',
                func: this.restorePassword,
                method: 'post',
                middlewares: [new validate_middleware_1.ValidateMiddleware(user_restore_dto_1.UserRestoreDto, '')],
            },
            {
                path: '/reset/:link',
                func: this.resetPassword,
                method: 'post',
                middlewares: [new validate_middleware_1.ValidateMiddleware(user_reset_dto_1.UserResetDto, '')],
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
            {
                path: '/logout',
                func: this.logout,
                method: 'get',
                middlewares: [],
            },
            {
                path: '/activate/:link',
                func: this.activate,
                method: 'get',
                middlewares: [],
            },
            {
                path: '/refresh',
                func: this.refresh,
                method: 'get',
                middlewares: [],
            },
            {
                path: '/liked',
                func: this.getLiked,
                method: 'get',
                middlewares: [new auth_guard_1.AuthGuard()],
            },
        ]);
    }
    register(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.loggerService.info(req.body);
                const result = yield this.userService.createUser(req.body);
                if (!result) {
                    return next(new http_error_1.HttpExeption('User already exists', 422));
                }
                const token = yield this.signJWT(req.body.email, this.configService.get('ACCESS_TOKEN'));
                res.cookie('refreshToken', result.token.refreshToken, {
                    maxAge: 30 * 24 * 60 * 60 * 1000,
                    httpOnly: true,
                    sameSite: 'none',
                    secure: true,
                });
                this.ok(res, {
                    user: result.user,
                    access_token: result.token.accessToken,
                });
            }
            catch (e) {
                return next(e);
            }
        });
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.userService.validateUser(req.body);
                const token = yield this.signJWT(req.body.email, this.configService.get('ACCESS_TOKEN'));
                res.cookie('refreshToken', result.token.refreshToken, {
                    maxAge: 30 * 24 * 60 * 60 * 1000,
                    httpOnly: true,
                    sameSite: 'none',
                    secure: true,
                });
                this.ok(res, {
                    user: result.user,
                    access_token: result.token.accessToken,
                });
            }
            catch (e) {
                next(e);
            }
        });
    }
    userRecipes(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page = undefined, limit = undefined } = req.query;
            this.ok(res, yield this.userService.getRecipes(req.userPayload.id, Number(page), Number(limit)));
            next();
        });
    }
    secret(req, res, next) {
        this.ok(res, { user: req.userPayload.email });
        next();
    }
    users(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            this.ok(res, yield this.userService.getAll());
            next();
        });
    }
    getLiked(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.userPayload.id;
            const { page = undefined, limit = undefined } = req.query;
            const result = yield this.userService.getLiked(userId, Number(page), Number(limit));
            this.ok(res, {
                total_pages: result.total,
                liked: result.liked,
            });
            next();
        });
    }
    logout(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { refreshToken } = req.cookies;
            const token = yield this.userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            this.ok(res, token);
        });
    }
    refresh(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { refreshToken } = req.cookies;
                const result = yield this.userService.refresh(refreshToken);
                res.cookie('refreshToken', result.token.refreshToken, {
                    maxAge: 30 * 24 * 60 * 60 * 1000,
                    httpOnly: true,
                    sameSite: 'none',
                    secure: true,
                });
                this.ok(res, {
                    user: result.user,
                    access_token: result.token.accessToken,
                });
            }
            catch (e) {
                next(e);
            }
        });
    }
    activate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const activationLink = req.params.link;
                const user = yield this.userService.activate(activationLink);
                res.redirect(this.configService.get('CLIENT_URL'));
            }
            catch (e) {
                next(e);
            }
        });
    }
    restorePassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const email = req.body.email;
                yield this.userService.restorePassword(email);
                this.ok(res, 'Mail was sent successfuly');
            }
            catch (e) {
                next(e);
            }
        });
    }
    resetPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { newPass } = req.body;
                yield this.userService.resetPassword(req.params.link, newPass);
                this.ok(res, { messsage: 'successful' });
            }
            catch (e) {
                next(e);
            }
        });
    }
    signJWT(email, secret) {
        return new Promise((resolve, reject) => {
            (0, jsonwebtoken_1.sign)({ email, iat: Math.floor(Date.now() / 999) }, secret, {
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