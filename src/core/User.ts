import { Recipe } from './Recipe';

export interface User {
	id: number;

	password: string;

	username: string;

	email: string;

	twitter?: string;

	instagram?: string;

	about?: string;

	recipes?: Recipe[];
}
