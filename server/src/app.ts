import express, { Express } from 'express';
import { Server } from 'http';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { TYPES } from './types';
import { ILogger } from './logger/logger.interface';
import { UserController } from './users/user.controller';
import { IExeptionFilter } from './errors/exeption.filter.interface';
import { IConfigService } from './config/config.service.interface';
import bodyParser from 'body-parser';
import { AuthMiddleware } from './common/auth.middleware';
import { createConnection } from 'typeorm';
import { User } from './users/user.entity';
import cors from 'cors';
import { RecipeController } from './recipes/recipe.controller';
import { Recipe, Step } from './recipes/recipe.entity';
import { UserRefactoring1710951505874 } from './migrations/1710951505874-UserRefactoring';
import { Token } from './token/token.entity';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import admin from 'firebase-admin';
import { cert } from 'firebase-admin/app';

@injectable()
export class App {
	app: Express;
	port: number;
	server: Server;

	constructor(
		@inject(TYPES.Logger) private logger: ILogger,
		@inject(TYPES.UserController) private userController: UserController,
		@inject(TYPES.RecipeController)
		private recipeController: RecipeController,
		@inject(TYPES.ExeptionFilter) private exeptionFilter: IExeptionFilter,
		@inject(TYPES.ConfigService) private configService: IConfigService
	) {
		this.app = express();
		this.port = 3000;
	}

	useRoutes() {
		this.app.use('/users', this.userController.router);
		this.app.use('/recipes', this.recipeController.router);
	}

	useMiddleware() {
		this.app.use(
			cors({
				credentials: true,
				origin: ['http://127.0.0.1:5173', 'http://localhost:5173'],
			})
		);
		this.app.use(bodyParser.json());
		const authMiddleware = new AuthMiddleware(
			this.configService.get('ACCESS_TOKEN')
		);
		this.app.use(cookieParser());
		this.app.use(authMiddleware.execute.bind(authMiddleware));
		this.app.use((req, res, next) => {
			res.header('Set-Cookie', 'my_cookie=value; SameSite=None; Secure');
			next();
		});
		this.app.use(fileUpload({}));
	}

	useExceptionFilters() {
		this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter));
	}

	public async init(): Promise<void> {
		this.useMiddleware();
		this.useRoutes();
		this.useExceptionFilters();

		const conn = await createConnection({
			type: 'postgres',
			host: this.configService.get('PGHOST'),
			database: this.configService.get('PGDATABASE'),
			username: this.configService.get('PGUSER'),
			password: this.configService.get('PGPASSWORD'),
			port: 5432,
			ssl: true,
			logging: false,
			migrations: [UserRefactoring1710951505874],
			synchronize: true,
			entities: [User, Recipe, Token, Step],
		});

		// admin.initializeApp({
		// 	credential: cert({
		// 		projectId: 'world-kitchen-84f19',
		// 		privateKey:
		// 			'-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDbI3bY1c/yvHSD\nVUiqB0R588ILoXpdhB21FjTT20rSnUA2hT/9kLa7anXrzsVVky8ja/woYNT4Rs1d\nwbmpHh/woLkyUbSTb0wZxQyr0MKqc0mTJfOYPMr5hUGu/MOEV6y13f9O3O2r/83m\nwPWkPqAUSCFuibVK0zrgAGu3819FtqkARUYT41Wzk0rsiYBznjhFhKuXL1CZMtyh\njOMNW1MFs8VFGn6oQTaS06aHsshZB+o34fQ5Au07XSkLQe2SP6idO1FL4rcwAg4B\nwHtdFCz/N2mzIrM52iuCVOZnUihjq51sqKl+/iLRGn6y5AyHUB/SW1+wPYFRDcBp\n3+weH15DAgMBAAECggEAIWP7/fpGX1Q75K8gDVhiJLrxvFf0jz9MT4V8szNc6U6w\ntB4FrBta3J/SLAYrp2hv7FPN7lEi4lnXfQvBwHUopL+4uGQewcBZtiuCTMPYhaRf\nd552yaGpw+98HK/DEu1REb0r49ZiGK03sIuCYm5wceazwWYWS7p35B3sS/E3eSWd\n10o0ILn8Wgc9UNs6wkWyaiNh7HjLYOSuTm3ZKX7GmJ7+qioBedP8TWDtS38wz3rm\ndXPyn235VmUZQVADLbWE8Maij9OYNo3uDizizOvDQvWInMHmaK9/1pUQiXSPLqv4\nho4Z6EYE+vx69jI8fhBVbxQmDhip6+ro2igXRZGh8QKBgQDvkYgqhrTtAa8a2aiP\n+hsqo5/W/okYzcjwi5AMpHMSvSVQwisIY9bHvP4QuwiOqunYKRPX9k1Ru+qAgfnC\njx+6XgzTmZGLMHan9HwA+ljhVAYXYXu9j+bNcDRhMucsLDwwTE5gvOSQ5MsocYn1\nWwvG8Siei1NcM479CzcrqqiGdQKBgQDqKzZufEI5N4QfDI7qFBWsRYHf1BssNxU9\n4x9AWqe/tZIdHVlL0YeNTplf9Ad7FfNCmmhinxX6i9gveRlLA0/aZaV1YPHbSukO\nehfl2zSz1aAUYAviRKPU3YzhU6pkXoasR5xclz0Rt8UpK4fbyuF08L6LJhNQ1cvA\n7sKOXgJq1wKBgDOkDFUWaoO4XDWOe55ljFuZn8fpYEYffdQUUX3YKRH+AcAxyrLp\nSpANtjqHBqYyQ2wcFrHz3uDif/8phVwiG/XBdkRakxwM21cDBYP0cxpHUXTSx6iq\nD1dze2cEYP6Nnn/OwwppTV/KYdya9OEVuiktLNNYNyTl3EnBlCfuhptNAoGBAIgF\nGdULsJvzt3choFIv4Hb02P/fAPmp9VjBeQG0pwQgwALRbXExAIAAS+8EnOPOWEMz\n1baTmfyzBpxsx1hfUB8YNAf+i/5JgR67pO4Lao2bZSTwtXZ1UITxPEgWhT9P+QJR\nhm3yG7MTAB9t/biaHGQFA2locIff6D7lcXWo/dZ5AoGAfvOQWonI63f8IbnZctOd\nRur4omPVYAewEoxugVELJ11g2oZzBKFdetPZwSVUK+UKTe/FVWzFqH7NzgMTVjuW\nM3jnqMcb4hocp1sV/n91t9P/2XbxgcU+UMsdAOMQbV+MLj3fmoxQXYxmt2IF2NAz\nMK/KtXsvCrkc6bLbZmxS/Dc=\n-----END PRIVATE KEY-----\n',
		// 		clientEmail:
		// 			'firebase-adminsdk-usrgb@world-kitchen-84f19.iam.gserviceaccount.com',
		// 	}),
		// 	storageBucket: 'gs://world-kitchen-84f19.appspot.com',
		// });

		this.server = this.app.listen(this.port);
		this.logger.info('server is listenning');
	}

	public close(): void {
		this.server.close();
	}
}
