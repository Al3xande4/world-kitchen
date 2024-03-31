import { inject, injectable } from 'inversify';
import {
	CreateUserReturn,
	IUserService,
	LikedReturn,
	RecipesReturn,
} from './user.service.interface';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types';
import { IUserRepository } from './user.repository.interface';
import { User } from './user.entity';
import { IMailService } from '../helpers/mail.service.interface';
import { ITokenService } from '../token/token.service.interface';
import { UserPayload } from './dto/user-payload.dto';
import { v4 } from 'uuid';
import { HttpExeption } from '../errors/http-error';
import { Token } from '../token/token.entity';
import { Recipe } from '../recipes/recipe.entity';

@injectable()
export class UserService implements IUserService {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.MailService) private mailService: IMailService,
		@inject(TYPES.UsersRepository) private userRepository: IUserRepository,
		@inject(TYPES.TokenService) private tokenService: ITokenService
	) {}

	async createUser({
		username,
		password,
		twitter,
		instagram,
		about,
		email,
	}: UserRegisterDto): CreateUserReturn {
		const newUser = new User({
			name: username,
			email: email,
			twitter,
			instagram,
			about,
			activationLink: v4(),
		});
		const salt = await this.configService.get('SALT');
		await newUser.setPassword(password, +salt);

		const existedUser = await this.userRepository.find(newUser.email);

		if (existedUser) {
			throw new HttpExeption(
				`User with email ${email} already exists`,
				401
			);
		}
		const user = await this.userRepository.create(newUser);
		if (!user) {
			throw new HttpExeption('Bad request', 404);
		}

		await this.mailService.sendActivationMail(
			email,
			`${this.configService.get('API_URL')}/users/activate/${
				user.activationLink
			}`
		);

		const token = await this.tokenService.generateToken({
			...new UserPayload(user),
		});
		await this.tokenService.saveToken(newUser.id, token.refreshToken);

		return { token, user };
	}

	async validateUser({
		email,
		password,
	}: UserLoginDto): Promise<CreateUserReturn> {
		const existedUser = await this.userRepository.find(email);

		if (!existedUser) {
			throw new HttpExeption(
				`User with email ${email} does not exits`,
				400
			);
		}

		const user = new User({
			email,
			hashPassword: password,
		});

		if (!(await user.checkPassword(existedUser.password))) {
			throw new HttpExeption(`Incorrect password or email.`, 400);
		}
		const token = await this.tokenService.generateToken({
			...new UserPayload(existedUser),
		});
		await this.tokenService.saveToken(existedUser.id, token.refreshToken);

		if (!existedUser.isActivated) {
			await this.mailService.sendActivationMail(
				email,
				`${this.configService.get('API_URL')}/users/activate/${
					existedUser.activationLink
				}`
			);
		}

		return { token, user: existedUser };
	}

	async activate(link: string): Promise<User | null> {
		const user = await this.userRepository.findBy({ activationLink: link });
		if (!user) {
			throw new HttpExeption('Invalid link', 403);
		}
		user.isActivated = true;
		return await this.userRepository.save(user);
	}

	async logout(refreshToken: string): Promise<Token | undefined> {
		const token = await this.tokenService.removeToken(refreshToken);
		return token;
	}

	async getLiked(
		userId: number,
		page: number = 1,
		limit?: number
	): LikedReturn {
		const user = await this.userRepository.get(userId);
		if (!user) {
			throw new HttpExeption('141', 422);
		}
		const totalLikedRecipes = user.likedRecipes.length;
		// Calculate the number of pages
		if (!limit) {
			return {
				liked: user.likedRecipes,
				total: 1,
			};
		}

		const totalPages = Math.ceil(totalLikedRecipes / limit);
		// Calculate the offset
		const offset = (page - 1) * limit;

		// Slice the liked recipes array based on pagination parameters
		const paginatedRecipes = user.likedRecipes.slice(
			offset,
			offset + limit
		);
		return { liked: paginatedRecipes, total: totalPages };
	}

	async restorePassword(email: string): Promise<void> {
		const user = await this.userRepository.find(email);
		if (!user) {
			throw new HttpExeption('User does not exist', 422);
		}
		user.restoreLink = v4();
		await user.save();
		await this.mailService.restoreMail(
			email,
			`${this.configService.get('CLIENT_URL')}/auth/reset/${
				user.restoreLink
			}`
		);
	}

	async getRecipes(
		userId: number,
		page?: number,
		limit?: number
	): RecipesReturn {
		const recipes = await this.userRepository.recipes(userId);
		if (!recipes) {
			throw new HttpExeption('Not such user', 422);
		}
		const totalLikedRecipes = recipes.length;
		// Calculate the number of pages
		if (!limit || !page) {
			return {
				recipes,
				total: 1,
			};
		}

		const totalPages = Math.ceil(totalLikedRecipes / limit);
		// Calculate the offset
		const offset = (page - 1) * limit;

		// Slice the liked recipes array based on pagination parameters
		const paginatedRecipes = recipes.slice(offset, offset + limit);
		return { recipes: paginatedRecipes, total: totalPages };
	}

	async resetPassword(resetLink: string, newPass: string): Promise<void> {
		const user = await this.userRepository.findBy({
			restoreLink: resetLink,
		});
		if (!user) {
			throw new HttpExeption('Invalid reset link.', 422);
		}
		await user.setPassword(newPass, +this.configService.get('SALT'));
		await user.save();
		return;
	}

	async getAll(): Promise<User[] | null> {
		return await this.userRepository.findAll();
	}

	async refresh(refreshToken: string): Promise<CreateUserReturn> {
		if (!refreshToken) {
			throw new HttpExeption('User is not authorized', 401);
		}
		const userData = await this.tokenService.validateRefreshToken(
			refreshToken
		);
		const token = await this.tokenService.findToken(refreshToken);

		if (!token || !userData) {
			throw new HttpExeption('User is not authorized', 401);
		}

		const user = await this.userRepository.get(userData.id);
		if (!user) {
			throw new HttpExeption('User is not authorized', 401);
		}

		const userDto = new UserPayload(user);
		const tokens = await this.tokenService.generateToken({ ...userDto });

		await this.tokenService.saveToken(userDto.id, tokens.refreshToken);
		return { user, token: tokens };
	}
}
