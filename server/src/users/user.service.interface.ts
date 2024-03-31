import { Recipe } from '../recipes/recipe.entity';
import { Token } from '../token/token.entity';
import { GenerateTokenReturn } from '../token/token.service.interface';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './user.entity';

export type CreateUserReturn = Promise<{
	user: User;
	token: GenerateTokenReturn;
}>;

export type LikedReturn = Promise<{
	liked: Recipe[];
	total: number;
}>;

export type RecipesReturn = Promise<{
	recipes: Recipe[];
	total: number;
}>;

export interface IUserService {
	createUser: (dto: UserRegisterDto) => CreateUserReturn;
	validateUser: (dto: UserLoginDto) => Promise<CreateUserReturn>;
	getAll: () => Promise<User[] | null>;
	activate: (link: string) => Promise<User | null>;
	logout: (refreshToken: string) => Promise<Token | undefined>;
	refresh: (refreshToken: string) => Promise<CreateUserReturn>;
	restorePassword: (email: string) => Promise<void>;
	resetPassword: (resetLink: string, newPass: string) => Promise<void>;
	getLiked: (userId: number, page?: number, limit?: number) => LikedReturn;
	getRecipes: (
		userId: number,
		page?: number,
		limit?: number
	) => RecipesReturn;
}
