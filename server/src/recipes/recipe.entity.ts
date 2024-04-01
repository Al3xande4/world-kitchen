import {
	BaseEntity,
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	ManyToMany,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Recipe extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	title: string;

	@Column()
	photoUrl: string;

	@Column()
	recipe: string;

	@Column({ nullable: true })
	about?: string;

	comments?: Comment[];

	@Column({ nullable: true, default: 0 })
	rating?: number = 0;

	@Column()
	authorId: number;

	@ManyToOne(() => User, { eager: false })
	author: User;

	@ManyToMany(() => User, (user) => user.likedRecipes, { cascade: true })
	likedByUsers: User[];

	@CreateDateColumn()
	createdAt: Date;

	@DeleteDateColumn()
	deletedAt: Date;

	@OneToMany(() => Step, (step) => step.recipe, { cascade: true })
	steps: Step[];

	@OneToMany(() => Ingredient, (ingredient) => ingredient.recipe, {
		cascade: true,
	})
	ingredients: Ingredient[];
}

export class Comment {}

@Entity()
export class Step extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ nullable: true })
	description: string;

	@Column()
	imageUrl: string;

	@ManyToOne(() => Recipe, (recipe) => recipe.steps)
	recipe: Recipe;
}

@Entity()
export class Ingredient extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	title: string;

	@Column()
	measure: string;

	@Column()
	imageUrl: string;

	@Column({ type: 'float' })
	count: number;

	@ManyToOne(() => Recipe, (recipe) => recipe.ingredients)
	recipe: Recipe;
}
