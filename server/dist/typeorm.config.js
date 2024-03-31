"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.conf = void 0;
const typeorm_1 = require("typeorm");
const recipe_entity_1 = require("./recipes/recipe.entity");
const user_entity_1 = require("./users/user.entity");
exports.conf = new typeorm_1.DataSource({
    type: 'postgres',
    database: 'recipeapp',
    username: 'postgres',
    password: 'postgres',
    host: 'localhost',
    port: 5432,
    logging: true,
    synchronize: true,
    entities: [user_entity_1.User, recipe_entity_1.Recipe],
});
//# sourceMappingURL=typeorm.config.js.map