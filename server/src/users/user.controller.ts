import { Request, Response, NextFunction } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { IUserController } from './user.controller.interface';
import { BaseController } from '../common/base.controller';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';
import { UserRegisterDto } from './dto/user-register.dto';
import { IUserService } from './user.service.interface';
import { IConfigService } from '../config/config.service.interface';
import { sign } from 'jsonwebtoken';
import { HttpExeption } from '../errors/http-error';
import { UserLoginDto } from './dto/user-login.dto';
import { ValidateMiddleware } from '../common/validate.middleware';
import { AuthGuard } from '../common/auth.guard';
import { UserRestoreDto } from './dto/user-restore.dto';
import { UserResetDto } from './dto/user-reset.dto';

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(
		@inject(TYPES.Logger) private loggerService: ILogger,
		@inject(TYPES.UserService) private userService: IUserService,
		@inject(TYPES.ConfigService) private configService: IConfigService
	) {
		super(loggerService);

		this.bindRoutes([
			{
				path: '/register',
				func: this.register,
				method: 'post',
				middlewares: [
					new ValidateMiddleware(
						UserRegisterDto,
						'Incorrect email or password'
					),
				],
			},
			{
				path: '/recipes',
				func: this.userRecipes,
				method: 'get',
				middlewares: [new AuthGuard()],
			},
			{
				path: '/login',
				func: this.login,
				method: 'post',
				middlewares: [
					new ValidateMiddleware(
						UserLoginDto,
						'Incorrect email or password.'
					),
				],
			},
			{
				path: '/restore',
				func: this.restorePassword,
				method: 'post',
				middlewares: [new ValidateMiddleware(UserRestoreDto, '')],
			},
			{
				path: '/reset/:link',
				func: this.resetPassword,
				method: 'post',
				middlewares: [new ValidateMiddleware(UserResetDto, '')],
			},
			{
				path: '/secret',
				func: this.secret,
				method: 'get',
				middlewares: [new AuthGuard()],
			},
			{
				path: '/',
				func: this.users,
				method: 'get',
				middlewares: [],
			},
			{
				path: '/logout',
				func: this.logout,
				method: 'get',
				middlewares: [],
			},
			{
				path: '/activate/:link',
				func: this.activate,
				method: 'get',
				middlewares: [],
			},
			{
				path: '/refresh',
				func: this.refresh,
				method: 'get',
				middlewares: [],
			},
			{
				path: '/liked',
				func: this.getLiked,
				method: 'get',
				middlewares: [new AuthGuard()],
			},
		]);
	}

	async register(
		req: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			this.loggerService.info(req.body);
			const result = await this.userService.createUser(req.body);

			if (!result) {
				return next(new HttpExeption('User already exists', 422));
			}

			const token = await this.signJWT(
				req.body.email,
				this.configService.get('ACCESS_TOKEN')
			);

			res.cookie('refreshToken', result.token.refreshToken, {
				maxAge: 30 * 24 * 60 * 60 * 1000,
				httpOnly: true,
				sameSite: 'none',
				secure: true,
			});

			this.ok(res, {
				user: result.user,
				access_token: result.token.accessToken,
			});
		} catch (e) {
			return next(e);
		}
	}
	async login(
		req: Request<{}, {}, UserLoginDto>,
		res: Response<any, Record<string, any>>,
		next: NextFunction
	): Promise<void> {
		try {
			const result = await this.userService.validateUser(req.body);
			const token = await this.signJWT(
				req.body.email,
				this.configService.get('ACCESS_TOKEN')
			);

			res.cookie('refreshToken', result.token.refreshToken, {
				maxAge: 30 * 24 * 60 * 60 * 1000,
				httpOnly: true,
				sameSite: 'none',
				secure: true,
			});

			this.ok(res, {
				user: result.user,
				access_token: result.token.accessToken,
			});
		} catch (e) {
			next(e);
		}
	}

	async userRecipes(
		req: Request,
		res: Response<any, Record<string, any>>,
		next: NextFunction
	): Promise<void> {
		const { page = undefined, limit = undefined } = req.query;
		this.ok(
			res,
			await this.userService.getRecipes(
				req.userPayload.id,
				Number(page),
				Number(limit)
			)
		);
		next();
	}

	secret(
		req: Request,
		res: Response<any, Record<string, any>>,
		next: NextFunction
	): void {
		this.ok(res, { user: req.userPayload.email });
		next();
	}

	async users(
		req: Request,
		res: Response<any, Record<string, any>>,
		next: NextFunction
	): Promise<void> {
		this.ok(res, await this.userService.getAll());
		next();
	}

	async getLiked(
		req: Request,
		res: Response<any, Record<string, any>>,
		next: NextFunction
	): Promise<void> {
		const userId = req.userPayload.id;
		const { page = undefined, limit = undefined } = req.query;
		const result = await this.userService.getLiked(
			userId,
			Number(page),
			Number(limit)
		);
		this.ok(res, {
			total_pages: result.total,
			liked: result.liked,
		});
		next();
	}

	async logout(
		req: Request,
		res: Response<any, Record<string, any>>,
		next: NextFunction
	): Promise<void> {
		const { refreshToken } = req.cookies;
		const token = await this.userService.logout(refreshToken);
		res.clearCookie('refreshToken');
		this.ok(res, token);
	}

	async refresh(
		req: Request,
		res: Response<any, Record<string, any>>,
		next: NextFunction
	): Promise<void> {
		try {
			const { refreshToken } = req.cookies;
			const result = await this.userService.refresh(refreshToken);

			res.cookie('refreshToken', result.token.refreshToken, {
				maxAge: 30 * 24 * 60 * 60 * 1000,
				httpOnly: true,
				sameSite: 'none',
				secure: true,
			});

			this.ok(res, {
				user: result.user,
				access_token: result.token.accessToken,
			});
		} catch (e) {
			next(e);
		}
	}

	async activate(
		req: Request,
		res: Response<any, Record<string, any>>,
		next: NextFunction
	): Promise<void> {
		try {
			const activationLink = req.params.link;
			const user = await this.userService.activate(activationLink);
			res.redirect(this.configService.get('CLIENT_URL'));
		} catch (e) {
			next(e);
		}
	}

	async restorePassword(
		req: Request<{}, {}, UserRestoreDto>,
		res: Response<any, Record<string, any>>,
		next: NextFunction
	): Promise<void> {
		try {
			const email = req.body.email;
			await this.userService.restorePassword(email);
			this.ok(res, 'Mail was sent successfuly');
		} catch (e) {
			next(e);
		}
	}

	async resetPassword(
		req: Request<any, {}, UserResetDto>,
		res: Response<any, Record<string, any>>,
		next: NextFunction
	): Promise<void> {
		try {
			const { newPass } = req.body;
			await this.userService.resetPassword(req.params.link, newPass);
			this.ok(res, { messsage: 'successful' });
		} catch (e) {
			next(e);
		}
	}

	private signJWT(email: string, secret: string): Promise<string> {
		return new Promise((resolve, reject) => {
			sign(
				{ email, iat: Math.floor(Date.now() / 999) },
				secret,
				{
					algorithm: 'HS256',
				},
				(err, token) => {
					if (err) {
						reject(err);
					}
					resolve(token as string);
				}
			);
		});
	}
}
