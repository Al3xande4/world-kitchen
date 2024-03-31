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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenService = void 0;
const inversify_1 = require("inversify");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const types_1 = require("../types");
const token_entity_1 = require("./token.entity");
const http_error_1 = require("../errors/http-error");
let TokenService = class TokenService {
    constructor(configService, userRepository) {
        this.configService = configService;
        this.userRepository = userRepository;
    }
    generateToken(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const accessToken = yield jsonwebtoken_1.default.sign(payload, this.configService.get('ACCESS_TOKEN'), { expiresIn: '30m' });
            const refreshToken = jsonwebtoken_1.default.sign(payload, this.configService.get('REFRESH_TOKEN'), { expiresIn: '30d' });
            return {
                accessToken,
                refreshToken,
            };
        });
    }
    saveToken(userId, refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const existedToken = yield token_entity_1.Token.findOne({
                where: { user: { id: userId } },
            });
            if (existedToken) {
                existedToken.refreshToken = refreshToken;
                return existedToken.save();
            }
            const user = yield this.userRepository.findBy({ id: userId });
            if (!user) {
                throw new http_error_1.HttpExeption('No such user with', 404);
            }
            const token = yield token_entity_1.Token.create({
                user,
                refreshToken,
            }).save();
            return token;
        });
    }
    removeToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = yield token_entity_1.Token.findOne({
                relations: {
                    user: true,
                },
                where: { refreshToken },
            });
            return yield (token === null || token === void 0 ? void 0 : token.remove());
        });
    }
    validateAccessToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payload = jsonwebtoken_1.default.verify(token, this.configService.get('ACCESS_TOKEN'));
                return payload;
            }
            catch (e) {
                return null;
            }
        });
    }
    validateRefreshToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payload = jsonwebtoken_1.default.verify(token, this.configService.get('REFRESH_TOKEN'));
                return payload;
            }
            catch (e) {
                return null;
            }
        });
    }
    findToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield token_entity_1.Token.findOne({
                relations: { user: true },
                where: { refreshToken: token },
            });
        });
    }
};
TokenService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ConfigService)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.UsersRepository)),
    __metadata("design:paramtypes", [Object, Object])
], TokenService);
exports.TokenService = TokenService;
//# sourceMappingURL=token.service.js.map