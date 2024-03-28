import { HTMLAttributes } from 'react';
import { Recipe } from '../../../core/Recipe';

export interface RecipeItemProps extends HTMLAttributes<HTMLElement> {
	recipe: Recipe;
	isFavourite?: boolean;
}
