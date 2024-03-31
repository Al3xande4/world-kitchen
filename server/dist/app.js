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
exports.App = void 0;
const express_1 = __importDefault(require("express"));
const inversify_1 = require("inversify");
require("reflect-metadata");
const types_1 = require("./types");
const user_controller_1 = require("./users/user.controller");
const body_parser_1 = __importDefault(require("body-parser"));
const auth_middleware_1 = require("./common/auth.middleware");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./users/user.entity");
const cors_1 = __importDefault(require("cors"));
const recipe_controller_1 = require("./recipes/recipe.controller");
const recipe_entity_1 = require("./recipes/recipe.entity");
const _1710951505874_UserRefactoring_1 = require("./migrations/1710951505874-UserRefactoring");
const token_entity_1 = require("./token/token.entity");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
let App = class App {
    constructor(logger, userController, recipeController, exeptionFilter, configService) {
        this.logger = logger;
        this.userController = userController;
        this.recipeController = recipeController;
        this.exeptionFilter = exeptionFilter;
        this.configService = configService;
        this.app = (0, express_1.default)();
        this.port = 3000;
    }
    useRoutes() {
        this.app.use('/users', this.userController.router);
        this.app.use('/recipes', this.recipeController.router);
    }
    useMiddleware() {
        this.app.use((0, cors_1.default)({
            credentials: true,
            origin: ['http://127.0.0.1:5173', 'http://localhost:5173'],
        }));
        this.app.use(body_parser_1.default.json());
        const authMiddleware = new auth_middleware_1.AuthMiddleware(this.configService.get('ACCESS_TOKEN'));
        this.app.use((0, cookie_parser_1.default)());
        this.app.use(authMiddleware.execute.bind(authMiddleware));
        this.app.use((req, res, next) => {
            res.header('Set-Cookie', 'my_cookie=value; SameSite=None; Secure');
            next();
        });
        this.app.use((0, express_fileupload_1.default)({}));
    }
    useExceptionFilters() {
        this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter));
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.useMiddleware();
            this.useRoutes();
            this.useExceptionFilters();
            const conn = yield (0, typeorm_1.createConnection)({
                type: 'postgres',
                host: this.configService.get('PGHOST'),
                database: this.configService.get('PGDATABASE'),
                username: this.configService.get('PGUSER'),
                password: this.configService.get('PGPASSWORD'),
                port: 5432,
                ssl: true,
                logging: false,
                migrations: [_1710951505874_UserRefactoring_1.UserRefactoring1710951505874],
                synchronize: true,
                entities: [user_entity_1.User, recipe_entity_1.Recipe, token_entity_1.Token, recipe_entity_1.Step],
            });
            this.server = this.app.listen(this.port);
            this.logger.info('server is listenning');
        });
    }
    close() {
        this.server.close();
    }
};
App = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.Logger)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.UserController)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.RecipeController)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.ExeptionFilter)),
    __param(4, (0, inversify_1.inject)(types_1.TYPES.ConfigService)),
    __metadata("design:paramtypes", [Object, user_controller_1.UserController,
        recipe_controller_1.RecipeController, Object, Object])
], App);
exports.App = App;
//# sourceMappingURL=app.js.map