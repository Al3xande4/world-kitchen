import { Request, Response, NextFunction } from 'express';
import { HttpExeption } from '../errors/http-error';
import { IMiddleware } from './middleware.interface';

export class AuthGuard implements IMiddleware {
	execute(req: Request, res: Response, next: NextFunction): void {
		if (req.userPayload) {
			return next();
		}
		next(new HttpExeption('You are not authorized', 401));
	}
}
