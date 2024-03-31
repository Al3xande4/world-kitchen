"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.boot = void 0;
const app_1 = require("./app");
const exeption_filter_1 = require("./errors/exeption.filter");
const user_controller_1 = require("./users/user.controller");
const dotenv_1 = __importDefault(require("dotenv"));
const inversify_1 = require("inversify");
const types_1 = require("./types");
require("reflect-metadata");
const config_service_1 = require("./config/config.service");
const user_service_1 = require("./users/user.service");
const logger_service_1 = require("./logger/logger.service");
const user_repository_1 = require("./users/user.repository");
const recipe_controller_1 = require("./recipes/recipe.controller");
const recipe_service_1 = require("./recipes/recipe.service");
const recipe_repository_1 = require("./recipes/recipe.repository");
const mail_service_1 = require("./helpers/mail.service");
const token_service_1 = require("./token/token.service");
const appBindings = new inversify_1.ContainerModule((bind) => {
    bind(types_1.TYPES.Application).to(app_1.App);
    bind(types_1.TYPES.Logger).to(logger_service_1.Logger).inSingletonScope();
    bind(types_1.TYPES.ExeptionFilter).to(exeption_filter_1.ExeptionFilter);
    bind(types_1.TYPES.ConfigService)
        .to(config_service_1.ConfigService)
        .inSingletonScope();
    bind(types_1.TYPES.UserController).to(user_controller_1.UserController);
    bind(types_1.TYPES.UserService).to(user_service_1.UserService);
    bind(types_1.TYPES.UsersRepository)
        .to(user_repository_1.UserRepository)
        .inSingletonScope();
    bind(types_1.TYPES.RecipeController).to(recipe_controller_1.RecipeController);
    bind(types_1.TYPES.RecipeService).to(recipe_service_1.RecipeService);
    bind(types_1.TYPES.RecipeRepository)
        .to(recipe_repository_1.RecipeRepository)
        .inSingletonScope();
    bind(types_1.TYPES.MailService).to(mail_service_1.MailService);
    bind(types_1.TYPES.TokenService).to(token_service_1.TokenService);
});
function bootstrap() {
    dotenv_1.default.config();
    const appContainer = new inversify_1.Container();
    appContainer.load(appBindings);
    const app = appContainer.get(types_1.TYPES.Application);
    app.init();
    return { app, appContainer };
}
exports.boot = bootstrap();
//# sourceMappingURL=main.js.map