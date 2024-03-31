import { Recipe } from '../../core/Recipe';

export interface UserRecipesState {
	recipes: Recipe[];
	total_pages: number;
}
