import { hash, compare } from 'bcryptjs';
import {
	BaseEntity,
	Column,
	Entity,
	JoinTable,
	ManyToMany,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Recipe } from '../recipes/recipe.entity';

type UserOptions = {
	name?: string;
	email: string;
	twitter?: string;
	instagram?: string;
	about?: string;
	hashPassword?: string;
	activationLink?: string;
};

@Entity()
export class User extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	password: string;

	@Column({ unique: false })
	username: string;

	@Column({ unique: true, nullable: true })
	email: string;

	@Column({ nullable: true })
	twitter?: string;

	@Column({ nullable: true })
	instagram?: string;

	@Column({ nullable: true })
	about?: string;

	@Column({ nullable: true })
	isActivated?: boolean;

	@Column({ nullable: true })
	activationLink?: string;

	@Column({ nullable: true })
	restoreLink?: string;

	@OneToMany(() => Recipe, (recipe) => recipe.author, { nullable: true })
	recipes?: Recipe[];

	@ManyToMany(() => Recipe, (recipe) => recipe.likedByUsers)
	@JoinTable()
	likedRecipes: Recipe[];

	constructor(options?: UserOptions) {
		super();
		if (!options) {
			return;
		}
		const {
			name,
			hashPassword,
			email,
			twitter,
			instagram,
			about,
			activationLink,
		} = options;
		if (hashPassword) {
			this.password = hashPassword;
		}
		if (name) {
			this.username = name;
		}
		this.email = email;
		this.twitter = twitter;
		this.instagram = instagram;
		this.about = about;
		this.activationLink = activationLink;
		this.likedRecipes = [];
	}

	async setPassword(pass: string, salt: number): Promise<void> {
		this.password = await hash(pass, salt);
	}

	async checkPassword(pass: string): Promise<boolean> {
		return compare(this.password, pass);
	}
}
