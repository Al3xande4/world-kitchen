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
exports.RecipeService = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../types");
const recipe_entity_1 = require("./recipe.entity");
const http_error_1 = require("../errors/http-error");
const user_entity_1 = require("../users/user.entity");
let RecipeService = class RecipeService {
    constructor(configService, recipeRepository, usersRepository) {
        this.configService = configService;
        this.recipeRepository = recipeRepository;
        this.usersRepository = usersRepository;
    }
    create(user, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const userDb = yield this.usersRepository.find(user);
            if (!userDb) {
                return;
            }
            const newRecipe = new recipe_entity_1.Recipe();
            newRecipe.title = dto.title;
            newRecipe.about = dto.about;
            newRecipe.authorId = userDb.id;
            newRecipe.recipe = dto.recipe;
            newRecipe.photoUrl = dto.previewUrl;
            newRecipe.steps = dto.steps;
            newRecipe.ingredients = dto.ingredients;
            return yield this.recipeRepository.create(newRecipe);
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.recipeRepository.findAll();
        });
    }
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.recipeRepository.get(id);
        });
    }
    delete(userId, recipeId) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.usersRepository.get(userId);
            const recipe = (_a = user === null || user === void 0 ? void 0 : user.recipes) === null || _a === void 0 ? void 0 : _a.find((el) => el.id == recipeId);
            if (!recipe || !user) {
                throw new http_error_1.HttpExeption('Cannot delete this recipe', 422);
            }
            yield this.usersRepository.deleteFavourite(user, recipeId);
            yield this.recipeRepository.delete(recipeId);
        });
    }
    addToFavourites(userId, recipeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.usersRepository.get(userId);
            if (!user) {
                throw new http_error_1.HttpExeption('No user', 422);
            }
            const recipe = yield this.recipeRepository.get(recipeId);
            if (!user.likedRecipes) {
                user.likedRecipes = [recipe];
            }
            else {
                user.likedRecipes.push(recipe);
            }
            yield user_entity_1.User.save(user);
            return recipe;
        });
    }
    removeFromFavourites(userId, recipeId, page = 1, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.usersRepository.get(userId);
            if (!user) {
                throw new http_error_1.HttpExeption('No user', 422);
            }
            const recipe = yield this.recipeRepository.get(recipeId);
            user.likedRecipes = user.likedRecipes.filter((el) => el.id != recipe.id);
            yield user_entity_1.User.save(user);
            const totalLikedRecipes = user.likedRecipes.length;
            if (!limit) {
                return {
                    liked: user.likedRecipes,
                    total: totalLikedRecipes,
                };
            }
            const totalPages = Math.ceil(totalLikedRecipes / limit);
            const offset = (page - 1) * limit;
            const paginatedRecipes = user.likedRecipes.slice(offset, offset + limit);
            return { liked: paginatedRecipes, total: totalPages };
        });
    }
};
RecipeService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ConfigService)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.RecipeRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.UsersRepository)),
    __metadata("design:paramtypes", [Object, Object, Object])
], RecipeService);
exports.RecipeService = RecipeService;
//# sourceMappingURL=recipe.service.js.map