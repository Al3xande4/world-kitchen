import { LikedReturn } from '../users/user.service.interface';
import { RecipeCreateDto } from './dtos/recipe-create.dto';
import { Recipe } from './recipe.entity';

export interface IRecipeService {
	create: (user: string, dto: RecipeCreateDto) => Promise<any>;
	getAll: () => Promise<any[]>;
	get: (id: number) => Promise<any>;
	delete: (userId: number, recipeId: number) => Promise<void>;
	addToFavourites: (userId: number, recipe: number) => Promise<Recipe>;
	removeFromFavourites: (
		userId: number,
		recipeId: number,
		page?: number,
		limit?: number
	) => LikedReturn;
}
