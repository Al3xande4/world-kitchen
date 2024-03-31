import { Step } from './Step';
import { User } from './User';

export interface Recipe {
	id: number;

	title: string;

	photoUrl: string;

	recipe: string;

	about?: string;

	comments?: string[];

	rating?: number;

	authorId: number;

	author: User;

	createdAt: Date;

	steps: Step[];

	likedByUsers: User[];
}

