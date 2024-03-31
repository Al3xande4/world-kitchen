import { DataSource } from 'typeorm';
import { Recipe } from './recipes/recipe.entity';
import { User } from './users/user.entity';

export const conf: DataSource = new DataSource({
	type: 'postgres',
	database: 'recipeapp',
	username: 'postgres',
	password: 'postgres',
	host: 'localhost',
	port: 5432,
	logging: true,
	synchronize: true,
	entities: [User, Recipe],
});
