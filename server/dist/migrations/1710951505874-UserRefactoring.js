"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRefactoring1710951505874 = void 0;
class UserRefactoring1710951505874 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`
            ALTER TABLE "recipe_likedByUsers_user" DROP CONSTRAINT "FK_abc123"; -- Drop the existing foreign key constraint
            ALTER TABLE "recipe_likedByUsers_user" ADD CONSTRAINT "FK_abc123" FOREIGN KEY ("recipeId") REFERENCES "recipe"("id") ON DELETE CASCADE; -- Add a new foreign key constraint with cascade option
            ALTER TABLE "recipe_steps_step" DROP CONSTRAINT "FK_def456"; -- Drop the existing foreign key constraint
            ALTER TABLE "recipe_steps_step" ADD CONSTRAINT "FK_def456" FOREIGN KEY ("recipeId") REFERENCES "recipe"("id") ON DELETE CASCADE; -- Add a new foreign key constraint with cascade option
        `);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "email" SET NOT NULL`);
        });
    }
}
exports.UserRefactoring1710951505874 = UserRefactoring1710951505874;
//# sourceMappingURL=1710951505874-UserRefactoring.js.map