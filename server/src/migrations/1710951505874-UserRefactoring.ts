import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserRefactoring1710951505874 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
            ALTER TABLE "recipe_likedByUsers_user" DROP CONSTRAINT "FK_abc123"; -- Drop the existing foreign key constraint
            ALTER TABLE "recipe_likedByUsers_user" ADD CONSTRAINT "FK_abc123" FOREIGN KEY ("recipeId") REFERENCES "recipe"("id") ON DELETE CASCADE; -- Add a new foreign key constraint with cascade option
            ALTER TABLE "recipe_steps_step" DROP CONSTRAINT "FK_def456"; -- Drop the existing foreign key constraint
            ALTER TABLE "recipe_steps_step" ADD CONSTRAINT "FK_def456" FOREIGN KEY ("recipeId") REFERENCES "recipe"("id") ON DELETE CASCADE; -- Add a new foreign key constraint with cascade option
        `);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "user" ALTER COLUMN "email" SET NOT NULL`
		);
	}
}
