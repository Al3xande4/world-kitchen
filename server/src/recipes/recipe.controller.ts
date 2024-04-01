import { Request, Response, NextFunction } from 'express';
import { IRecipeController } from './recipe.controller.interface';
import { BaseController } from '../common/base.controller';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';
import { RecipeCreateDto } from './dtos/recipe-create.dto';
import { AuthGuard } from '../common/auth.guard';
import { IRecipeService } from './recipe.service.interface';
import { HttpExeption } from '../errors/http-error';
import { storage } from 'firebase-admin';
import { UploadedFile } from 'express-fileupload';
import { v4 } from 'uuid';
import { ValidateMiddleware } from '../common/validate.middleware';

@injectable()
export class RecipeController
	extends BaseController
	implements IRecipeController
{
	constructor(
		@inject(TYPES.Logger) private loggerService: ILogger,
		@inject(TYPES.RecipeService) private recipeService: IRecipeService
	) {
		super(loggerService);

		this.bindRoutes([
			{
				path: '/',
				method: 'post',
				func: this.create,
				middlewares: [
					new AuthGuard(),
					new ValidateMiddleware(RecipeCreateDto, 'bad request'),
				],
			},
			{
				path: '/:id',
				method: 'delete',
				func: this.delete,
				middlewares: [new AuthGuard()],
			},
			{
				path: '/',
				method: 'get',
				func: this.recipe,
				middlewares: [],
			},
			{
				path: '/:id',
				method: 'get',
				func: this.get,
				middlewares: [],
			},
			{
				path: '/like/:id',
				method: 'get',
				func: this.addToFavourite,
				middlewares: [new AuthGuard()],
			},
			{
				path: '/unlike/:id',
				method: 'get',
				func: this.removeFromFavourite,
				middlewares: [new AuthGuard()],
			},
		]);
	}

	async addToFavourite(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		req.userPayload.id;
		const recipeId = +req.params.id;
		const userId = req.userPayload.id;
		try {
			this.ok(
				res,
				await this.recipeService.addToFavourites(userId, recipeId)
			);
			next();
		} catch (e) {
			next(e);
		}
	}

	async removeFromFavourite(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		req.userPayload.id;
		const recipeId = +req.params.id;
		const userId = req.userPayload.id;
		const { page, limit } = req.query;
		const result = await this.recipeService.removeFromFavourites(
			userId,
			recipeId,
			Number(page),
			Number(limit)
		);
		try {
			this.ok(res, { total_pages: result.total, liked: result.liked });
			next();
		} catch (e) {
			next(e);
		}
	}

	async get(req: Request, res: Response, next: NextFunction): Promise<void> {
		this.ok(res, await this.recipeService.get(+req.params.id));
		next();
	}

	async delete(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			await this.recipeService.delete(req.userPayload.id, +req.params.id);
			this.ok(res, {
				message: 'deleted',
			});
		} catch (e) {
			this.ok(res, {
				error: e,
			});
		}
	}

	async recipe(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		this.ok(res, await this.recipeService.getAll());
		next();
	}

	async create(
		req: Request<{}, RecipeCreateDto>,
		res: Response,
		next: NextFunction
	): Promise<void> {
		this.logger.info(req.body);
		this.ok(res, {
			data: await this.recipeService.create(
				req.userPayload.email,
				req.body
			),
		});
	}
}
