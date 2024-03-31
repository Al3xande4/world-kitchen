import { NextFunction, Request, Response } from 'express';

export interface IRecipeController {
	create: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	recipe: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	get: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	delete: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	addToFavourite: (
		req: Request,
		res: Response,
		next: NextFunction
	) => Promise<void>;
	removeFromFavourite: (
		req: Request,
		res: Response,
		next: NextFunction
	) => Promise<void>;
}
