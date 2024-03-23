import { User } from './User';

export interface LoginResponse {
	user: User;
	access_token: string;
}
