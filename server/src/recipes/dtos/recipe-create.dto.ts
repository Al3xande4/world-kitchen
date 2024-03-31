import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Step } from '../recipe.entity';

export class RecipeCreateDto {
	@IsNotEmpty()
	title: string;

	@IsNotEmpty()
	previewUrl: string;

	@IsNotEmpty()
	recipe: string;

	about?: string;

	steps: Step[];
}
