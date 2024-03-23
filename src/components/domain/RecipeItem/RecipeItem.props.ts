import { HTMLAttributes } from 'react';
import { Recipe } from '../../../interfaces/Recipe';

export interface RecipeItemProps extends HTMLAttributes<HTMLElement> {
	recipe: Recipe;
	isFavourite?: boolean;
}
