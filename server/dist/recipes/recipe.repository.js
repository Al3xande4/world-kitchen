"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.RecipeRepository = void 0;
const inversify_1 = require("inversify");
const recipe_entity_1 = require("./recipe.entity");
let RecipeRepository = class RecipeRepository {
    create(recipe) {
        return __awaiter(this, void 0, void 0, function* () {
            return recipe_entity_1.Recipe.create(Object.assign({}, recipe)).save();
        });
    }
    findAll(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            if (page && limit) {
                const skip = (page - 1) * limit;
                return yield recipe_entity_1.Recipe.find({
                    order: { id: 'ASC' },
                    relations: ['likedByUsers', 'steps', 'ingredients'],
                    take: limit,
                    skip,
                });
            }
            return yield recipe_entity_1.Recipe.find({
                order: { id: 'ASC' },
                relations: ['likedByUsers', 'steps', 'ingredients'],
            });
        });
    }
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield recipe_entity_1.Recipe.findOne({
                where: { id },
                relations: ['likedByUsers', 'steps', 'ingredients'],
            });
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const recipe = yield recipe_entity_1.Recipe.findOne({
                where: { id },
                relations: ['steps', 'ingredients'],
            });
            if (!recipe) {
                return null;
            }
            yield recipe_entity_1.Step.remove(recipe.steps);
            yield recipe_entity_1.Ingredient.remove(recipe.ingredients);
            return yield recipe_entity_1.Recipe.delete({ id });
        });
    }
};
RecipeRepository = __decorate([
    (0, inversify_1.injectable)()
], RecipeRepository);
exports.RecipeRepository = RecipeRepository;
//# sourceMappingURL=recipe.repository.js.map