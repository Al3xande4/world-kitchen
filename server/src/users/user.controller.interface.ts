import { NextFunction, Request, Response } from 'express';

export interface IUserController {
	register: (
		req: Request,
		res: Response,
		next: NextFunction
	) => Promise<void>;
	login: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	secret: (req: Request, res: Response, next: NextFunction) => void;
	users: (req: Request, res: Response, next: NextFunction) => void;
	logout: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	activate: (
		req: Request,
		res: Response,
		next: NextFunction
	) => Promise<void>;
	refresh: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	restorePassword: (
		req: Request,
		res: Response,
		next: NextFunction
	) => Promise<void>;
	resetPassword: (
		req: Request,
		res: Response,
		next: NextFunction
	) => Promise<void>;
	getLiked: (
		req: Request,
		res: Response,
		next: NextFunction
	) => Promise<void>;
	userRecipes: (
		req: Request,
		res: Response,
		next: NextFunction
	) => Promise<void>;
}
