import { User } from '../core/User';

export interface LoginResponse {
	user: User;
	access_token: string;
}
