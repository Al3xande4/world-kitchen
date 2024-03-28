import { Recipe } from '../core/Recipe';

export interface UserRecipesResponse {
	recipes: Recipe[];
	total: number;
}
