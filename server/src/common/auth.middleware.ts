import { Request, Response, NextFunction } from 'express';
import { IMiddleware } from './middleware.interface';
import { verify } from 'jsonwebtoken';
import { HttpExeption } from '../errors/http-error';
import { inject } from 'inversify';
import { TYPES } from '../types';
import { ITokenService } from '../token/token.service.interface';

export class AuthMiddleware implements IMiddleware {
	constructor(private accessToken: string) {}

	execute(req: Request, res: Response, next: NextFunction): void {
		if (!req.headers.authorization) {
			return next();
		}

		verify(
			req.headers.authorization.split(' ')[1],
			this.accessToken,
			(err, payload: any) => {
				if (err) {
					next();
				} else if (payload) {
					req.userPayload = payload;
					next();
				}
			}
		);
	}
}
