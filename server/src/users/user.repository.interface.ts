import { Recipe } from '../recipes/recipe.entity';
import { User } from './user.entity';

export interface IUserRepository {
	create: (user: User) => Promise<User | null>;
	find: (email: string) => Promise<User | null>;
	findBy: (where: any) => Promise<User | null>;
	findAll: () => Promise<User[] | null>;
	save: (user: User) => Promise<User | null>;
	get: (id: number) => Promise<User | null>;
	deleteFavourite: (user: User, id: number) => Promise<any>;
	recipes: (id: number) => Promise<Recipe[] | undefined>;
}
