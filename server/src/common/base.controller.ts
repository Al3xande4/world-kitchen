import { injectable } from 'inversify';
import { ILogger } from '../logger/logger.interface';
import { ExpressReturnType, IRouteController } from './route.interface';
import { Response, Router } from 'express';

@injectable()
export abstract class BaseController {
	logger: ILogger;

	private readonly _router: Router;

	get router(): Router {
		return this._router;
	}

	constructor(logger: ILogger) {
		this._router = Router();
		this.logger = logger;
	}

	bindRoutes(routes: IRouteController[]): void {
		for (const route of routes) {
			this.logger.info(`[${route.method}]: ${route.path}`);
			const middleware = route.middlewares?.map((m) => m.execute.bind(m));
			const handler = route.func.bind(this);
			const pipeline = middleware ? [...middleware, handler] : handler;
			this.router[route.method](route.path, pipeline);
		}
	}

	public send<T>(
		res: Response,
		message: T,
		statusCode: number
	): ExpressReturnType {
		return res.status(statusCode).send(message);
	}

	public ok<T>(res: Response, message: T): ExpressReturnType {
		return this.send<T>(res, message, 200);
	}
}
