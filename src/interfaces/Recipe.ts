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
}
