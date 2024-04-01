import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Ingredient, Step } from '../recipe.entity';

export class RecipeCreateDto {
	@IsNotEmpty()
	title: string;

	@IsNotEmpty()
	previewUrl: string;

	@IsNotEmpty()
	recipe: string;

	about?: string;

	steps: Step[];

	ingredients: Ingredient[];
}
