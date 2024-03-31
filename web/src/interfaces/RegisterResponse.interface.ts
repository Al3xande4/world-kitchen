import { User } from '../core/User';

export interface RegisterResponse {
	user: User;
	access_token: string;
}
