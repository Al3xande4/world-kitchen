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
exports.RecipeController = void 0;
const base_controller_1 = require("../common/base.controller");
const inversify_1 = require("inversify");
require("reflect-metadata");
const types_1 = require("../types");
const recipe_create_dto_1 = require("./dtos/recipe-create.dto");
const auth_guard_1 = require("../common/auth.guard");
const validate_middleware_1 = require("../common/validate.middleware");
let RecipeController = class RecipeController extends base_controller_1.BaseController {
    constructor(loggerService, recipeService) {
        super(loggerService);
        this.loggerService = loggerService;
        this.recipeService = recipeService;
        this.bindRoutes([
            {
                path: '/',
                method: 'post',
                func: this.create,
                middlewares: [
                    new auth_guard_1.AuthGuard(),
                    new validate_middleware_1.ValidateMiddleware(recipe_create_dto_1.RecipeCreateDto, 'bad request'),
                ],
            },
            {
                path: '/:id',
                method: 'delete',
                func: this.delete,
                middlewares: [new auth_guard_1.AuthGuard()],
            },
            {
                path: '/',
                method: 'get',
                func: this.recipe,
                middlewares: [],
            },
            {
                path: '/:id',
                method: 'get',
                func: this.get,
                middlewares: [],
            },
            {
                path: '/like/:id',
                method: 'get',
                func: this.addToFavourite,
                middlewares: [new auth_guard_1.AuthGuard()],
            },
            {
                path: '/unlike/:id',
                method: 'get',
                func: this.removeFromFavourite,
                middlewares: [new auth_guard_1.AuthGuard()],
            },
        ]);
    }
    addToFavourite(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            req.userPayload.id;
            const recipeId = +req.params.id;
            const userId = req.userPayload.id;
            try {
                this.ok(res, yield this.recipeService.addToFavourites(userId, recipeId));
                next();
            }
            catch (e) {
                next(e);
            }
        });
    }
    removeFromFavourite(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            req.userPayload.id;
            const recipeId = +req.params.id;
            const userId = req.userPayload.id;
            const { page, limit } = req.query;
            const result = yield this.recipeService.removeFromFavourites(userId, recipeId, Number(page), Number(limit));
            try {
                this.ok(res, { total_pages: result.total, liked: result.liked });
                next();
            }
            catch (e) {
                next(e);
            }
        });
    }
    get(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            this.ok(res, yield this.recipeService.get(+req.params.id));
            next();
        });
    }
    delete(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.recipeService.delete(req.userPayload.id, +req.params.id);
                this.ok(res, {
                    message: 'deleted',
                });
            }
            catch (e) {
                this.ok(res, {
                    error: e,
                });
            }
        });
    }
    recipe(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            this.ok(res, yield this.recipeService.getAll());
            next();
        });
    }
    create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.info(req.body);
            this.ok(res, {
                data: yield this.recipeService.create(req.userPayload.email, req.body),
            });
        });
    }
};
RecipeController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.Logger)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.RecipeService)),
    __metadata("design:paramtypes", [Object, Object])
], RecipeController);
exports.RecipeController = RecipeController;
//# sourceMappingURL=recipe.controller.js.map