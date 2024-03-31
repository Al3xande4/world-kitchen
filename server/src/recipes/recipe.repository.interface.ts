import { Recipe } from './recipe.entity';

export interface IRecipeRepository {
	create: (recipe: Recipe) => Promise<any>;
	findAll: () => Promise<any>;
	get: (id: number) => Promise<Recipe>;
	delete: (id: number) => Promise<Recipe>;
}
