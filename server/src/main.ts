import { App } from './app';
import { ExeptionFilter } from './errors/exeption.filter';
import { UserController } from './users/user.controller';
import dotenv from 'dotenv';
import { Container, ContainerModule, interfaces } from 'inversify';
import { TYPES } from './types';
import { ILogger } from './logger/logger.interface';
import { IExeptionFilter } from './errors/exeption.filter.interface';
import 'reflect-metadata';
import { IUserService } from './users/user.service.interface';
import { IConfigService } from './config/config.service.interface';
import { ConfigService } from './config/config.service';
import { UserService } from './users/user.service';
import { Logger } from './logger/logger.service';
import { IUserController } from './users/user.controller.interface';
import { IUserRepository } from './users/user.repository.interface';
import { UserRepository } from './users/user.repository';
import { IRecipeController } from './recipes/recipe.controller.interface';
import { RecipeController } from './recipes/recipe.controller';
import { RecipeService } from './recipes/recipe.service';
import { IRecipeService } from './recipes/recipe.service.interface';
import { IRecipeRepository } from './recipes/recipe.repository.interface';
import { RecipeRepository } from './recipes/recipe.repository';
import { IMailService } from './helpers/mail.service.interface';
import { MailService } from './helpers/mail.service';
import { ITokenService } from './token/token.service.interface';
import { TokenService } from './token/token.service';

export interface IBootstrapReturn {
	appContainer: Container;
	app: App;
}

const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<App>(TYPES.Application).to(App);

	bind<ILogger>(TYPES.Logger).to(Logger).inSingletonScope();
	bind<IExeptionFilter>(TYPES.ExeptionFilter).to(ExeptionFilter);
	bind<IConfigService>(TYPES.ConfigService)
		.to(ConfigService)
		.inSingletonScope();

	bind<IUserController>(TYPES.UserController).to(UserController);
	bind<IUserService>(TYPES.UserService).to(UserService);
	bind<IUserRepository>(TYPES.UsersRepository)
		.to(UserRepository)
		.inSingletonScope();

	bind<IRecipeController>(TYPES.RecipeController).to(RecipeController);
	bind<IRecipeService>(TYPES.RecipeService).to(RecipeService);
	bind<IRecipeRepository>(TYPES.RecipeRepository)
		.to(RecipeRepository)
		.inSingletonScope();

	bind<IMailService>(TYPES.MailService).to(MailService);
	bind<ITokenService>(TYPES.TokenService).to(TokenService);
});

function bootstrap(): IBootstrapReturn {
	dotenv.config();
	const appContainer = new Container();
	appContainer.load(appBindings);
	const app = appContainer.get<App>(TYPES.Application);
	app.init();
	return { app, appContainer };
}

export const boot = bootstrap();
