import { injectable } from 'inversify';
import { User } from './user.entity';
import { IUserRepository } from './user.repository.interface';
import { Recipe } from '../recipes/recipe.entity';

@injectable()
export class UserRepository implements IUserRepository {
	async create(user: User): Promise<any> {
		return User.create({
			...user,
		}).save();
	}

	async find(email: string): Promise<User | null> {
		return await User.findOne({
			order: { id: 'ASC' },
			where: { email },
			relations: ['recipes'],
		});
	}

	async findBy(where: any): Promise<User | null> {
		return await User.findOne({
			order: { id: 'ASC' },
			where,
		});
	}

	async findAll(): Promise<User[] | null> {
		return await User.find({});
	}

	async save(user: User): Promise<User> {
		return user.save();
	}

	async deleteFavourite(user: User, id: number) {
		user.likedRecipes = user.likedRecipes.filter((el) => el.id != id);
		user.save();
	}

	async recipes(id: number): Promise<Recipe[] | undefined> {
		const user = await User.findOne({
			where: { id },
			relations: ['recipes'],
		});
		return user?.recipes;
	}

	async get(id: number): Promise<User | null> {
		return User.findOne({
			order: { id: 'ASC' },
			where: { id },
			relations: ['likedRecipes', 'recipes'],
		});
	}
}
