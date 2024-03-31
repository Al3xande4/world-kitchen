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
exports.UserService = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../types");
const user_entity_1 = require("./user.entity");
const user_payload_dto_1 = require("./dto/user-payload.dto");
const uuid_1 = require("uuid");
const http_error_1 = require("../errors/http-error");
let UserService = class UserService {
    constructor(configService, mailService, userRepository, tokenService) {
        this.configService = configService;
        this.mailService = mailService;
        this.userRepository = userRepository;
        this.tokenService = tokenService;
    }
    createUser({ username, password, twitter, instagram, about, email, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const newUser = new user_entity_1.User({
                name: username,
                email: email,
                twitter,
                instagram,
                about,
                activationLink: (0, uuid_1.v4)(),
            });
            const salt = yield this.configService.get('SALT');
            yield newUser.setPassword(password, +salt);
            const existedUser = yield this.userRepository.find(newUser.email);
            if (existedUser) {
                throw new http_error_1.HttpExeption(`User with email ${email} already exists`, 401);
            }
            const user = yield this.userRepository.create(newUser);
            if (!user) {
                throw new http_error_1.HttpExeption('Bad request', 404);
            }
            yield this.mailService.sendActivationMail(email, `${this.configService.get('API_URL')}/users/activate/${user.activationLink}`);
            const token = yield this.tokenService.generateToken(Object.assign({}, new user_payload_dto_1.UserPayload(user)));
            yield this.tokenService.saveToken(newUser.id, token.refreshToken);
            return { token, user };
        });
    }
    validateUser({ email, password, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const existedUser = yield this.userRepository.find(email);
            if (!existedUser) {
                throw new http_error_1.HttpExeption(`User with email ${email} does not exits`, 400);
            }
            const user = new user_entity_1.User({
                email,
                hashPassword: password,
            });
            if (!(yield user.checkPassword(existedUser.password))) {
                throw new http_error_1.HttpExeption(`Incorrect password or email.`, 400);
            }
            const token = yield this.tokenService.generateToken(Object.assign({}, new user_payload_dto_1.UserPayload(existedUser)));
            yield this.tokenService.saveToken(existedUser.id, token.refreshToken);
            if (!existedUser.isActivated) {
                yield this.mailService.sendActivationMail(email, `${this.configService.get('API_URL')}/users/activate/${existedUser.activationLink}`);
            }
            return { token, user: existedUser };
        });
    }
    activate(link) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findBy({ activationLink: link });
            if (!user) {
                throw new http_error_1.HttpExeption('Invalid link', 403);
            }
            user.isActivated = true;
            return yield this.userRepository.save(user);
        });
    }
    logout(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = yield this.tokenService.removeToken(refreshToken);
            return token;
        });
    }
    getLiked(userId, page = 1, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.get(userId);
            if (!user) {
                throw new http_error_1.HttpExeption('141', 422);
            }
            const totalLikedRecipes = user.likedRecipes.length;
            if (!limit) {
                return {
                    liked: user.likedRecipes,
                    total: 1,
                };
            }
            const totalPages = Math.ceil(totalLikedRecipes / limit);
            const offset = (page - 1) * limit;
            const paginatedRecipes = user.likedRecipes.slice(offset, offset + limit);
            return { liked: paginatedRecipes, total: totalPages };
        });
    }
    restorePassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.find(email);
            if (!user) {
                throw new http_error_1.HttpExeption('User does not exist', 422);
            }
            user.restoreLink = (0, uuid_1.v4)();
            yield user.save();
            yield this.mailService.restoreMail(email, `${this.configService.get('CLIENT_URL')}/auth/reset/${user.restoreLink}`);
        });
    }
    getRecipes(userId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const recipes = yield this.userRepository.recipes(userId);
            if (!recipes) {
                throw new http_error_1.HttpExeption('Not such user', 422);
            }
            const totalLikedRecipes = recipes.length;
            if (!limit || !page) {
                return {
                    recipes,
                    total: 1,
                };
            }
            const totalPages = Math.ceil(totalLikedRecipes / limit);
            const offset = (page - 1) * limit;
            const paginatedRecipes = recipes.slice(offset, offset + limit);
            return { recipes: paginatedRecipes, total: totalPages };
        });
    }
    resetPassword(resetLink, newPass) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findBy({
                restoreLink: resetLink,
            });
            if (!user) {
                throw new http_error_1.HttpExeption('Invalid reset link.', 422);
            }
            yield user.setPassword(newPass, +this.configService.get('SALT'));
            yield user.save();
            return;
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userRepository.findAll();
        });
    }
    refresh(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!refreshToken) {
                throw new http_error_1.HttpExeption('User is not authorized', 401);
            }
            const userData = yield this.tokenService.validateRefreshToken(refreshToken);
            const token = yield this.tokenService.findToken(refreshToken);
            if (!token || !userData) {
                throw new http_error_1.HttpExeption('User is not authorized', 401);
            }
            const user = yield this.userRepository.get(userData.id);
            if (!user) {
                throw new http_error_1.HttpExeption('User is not authorized', 401);
            }
            const userDto = new user_payload_dto_1.UserPayload(user);
            const tokens = yield this.tokenService.generateToken(Object.assign({}, userDto));
            yield this.tokenService.saveToken(userDto.id, tokens.refreshToken);
            return { user, token: tokens };
        });
    }
};
UserService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ConfigService)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.MailService)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.UsersRepository)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.TokenService)),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map