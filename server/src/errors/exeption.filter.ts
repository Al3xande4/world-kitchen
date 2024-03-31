import { Request, Response } from 'express';
import { NextFunction } from 'express-serve-static-core';
import { inject, injectable } from 'inversify';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';
import { IExeptionFilter } from './exeption.filter.interface';
import { HttpExeption } from './http-error';
import 'reflect-metadata';

@injectable()
export class ExeptionFilter implements IExeptionFilter {
	constructor(@inject(TYPES.Logger) private logger: ILogger) {}

	catch(
		err: Error | HttpExeption,
		req: Request,
		res: Response,
		next: NextFunction
	): void {
		if (err instanceof HttpExeption) {
			this.logger.error(
				`[${err.context}] ${err.statusCode}: ${err.message}`
			);
			res.status(err.statusCode).send({ message: err.message });
		} else {
			this.logger.error(`${err.message}`);
			res.status(500).send({ error: err.message });
		}
	}
}
