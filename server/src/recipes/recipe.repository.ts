import { injectable } from 'inversify';
import { Ingredient, Recipe, Step } from './recipe.entity';
import { IRecipeRepository } from './recipe.repository.interface';
import { User } from '../users/user.entity';

@injectable()
export class RecipeRepository implements IRecipeRepository {
	async create(recipe: Recipe): Promise<any> {
		return Recipe.create({
			...recipe,
		}).save();
	}

	async findAll(page?: number, limit?: number): Promise<any> {
		if (page && limit) {
			const skip = (page - 1) * limit;
			return await Recipe.find({
				order: { id: 'ASC' },
				relations: ['likedByUsers', 'steps', 'ingredients'],
				take: limit,
				skip,
			});
		}
		return await Recipe.find({
			order: { id: 'ASC' },
			relations: ['likedByUsers', 'steps', 'ingredients'],
		});
	}

	async get(id: number): Promise<any> {
		return await Recipe.findOne({
			where: { id },
			relations: ['likedByUsers', 'steps', 'ingredients'],
		});
	}

	async delete(id: number): Promise<any> {
		const recipe = await Recipe.findOne({
			where: { id },
			relations: ['steps', 'ingredients'],
		});
		if (!recipe) {
			return null;
		}
		await Step.remove(recipe.steps);
		await Ingredient.remove(recipe.ingredients);
		return await Recipe.delete({ id });
	}
}
