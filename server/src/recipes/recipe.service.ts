import { inject, injectable } from 'inversify';
import { IRecipeService } from './recipe.service.interface';
import { RecipeCreateDto } from './dtos/recipe-create.dto';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types';
import { IRecipeRepository } from './recipe.repository.interface';
import { Recipe } from './recipe.entity';
import { IUserRepository } from '../users/user.repository.interface';
import { HttpExeption } from '../errors/http-error';
import { User } from '../users/user.entity';
import { LikedReturn } from '../users/user.service.interface';

@injectable()
export class RecipeService implements IRecipeService {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.RecipeRepository)
		private recipeRepository: IRecipeRepository,
		@inject(TYPES.UsersRepository) private usersRepository: IUserRepository
	) {}
	async create(user: string, dto: RecipeCreateDto): Promise<any> {
		const userDb = await this.usersRepository.find(user);
		if (!userDb) {
			return;
		}
		const newRecipe = new Recipe();
		newRecipe.title = dto.title;
		newRecipe.about = dto.about;
		newRecipe.authorId = userDb.id;
		newRecipe.recipe = dto.recipe;
		newRecipe.photoUrl = dto.previewUrl;
		newRecipe.steps = dto.steps;
		newRecipe.ingredients = dto.ingredients;
		return await this.recipeRepository.create(newRecipe);
	}

	async getAll(): Promise<any[]> {
		return this.recipeRepository.findAll();
	}

	async get(id: number): Promise<any> {
		return await this.recipeRepository.get(id);
	}

	async delete(userId: number, recipeId: number): Promise<void> {
		const user = await this.usersRepository.get(userId);
		const recipe = user?.recipes?.find((el) => el.id == recipeId);
		if (!recipe || !user) {
			throw new HttpExeption('Cannot delete this recipe', 422);
		}
		await this.usersRepository.deleteFavourite(user, recipeId);
		await this.recipeRepository.delete(recipeId);
	}

	async addToFavourites(userId: number, recipeId: number) {
		const user = await this.usersRepository.get(userId);
		if (!user) {
			throw new HttpExeption('No user', 422);
		}
		const recipe = await this.recipeRepository.get(recipeId);
		if (!user.likedRecipes) {
			user.likedRecipes = [recipe];
		} else {
			user.likedRecipes.push(recipe);
		}
		await User.save(user);
		return recipe;
	}

	async removeFromFavourites(
		userId: number,
		recipeId: number,
		page: number = 1,
		limit?: number
	): LikedReturn {
		const user = await this.usersRepository.get(userId);
		if (!user) {
			throw new HttpExeption('No user', 422);
		}
		const recipe = await this.recipeRepository.get(recipeId);
		user.likedRecipes = user.likedRecipes.filter(
			(el) => el.id != recipe.id
		);
		await User.save(user);
		const totalLikedRecipes = user.likedRecipes.length;

		// Calculate the number of pages
		if (!limit) {
			return {
				liked: user.likedRecipes,
				total: totalLikedRecipes,
			};
		}

		const totalPages = Math.ceil(totalLikedRecipes / limit);
		// Calculate the offset
		const offset = (page - 1) * limit;

		// Slice the liked recipes array based on pagination parameters
		const paginatedRecipes = user.likedRecipes.slice(
			offset,
			offset + limit
		);
		return { liked: paginatedRecipes, total: totalPages };
	}
}
