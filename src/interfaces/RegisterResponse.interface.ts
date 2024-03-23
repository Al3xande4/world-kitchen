import { User } from './User';

export interface RegisterResponse {
	user: User;
	access_token: string;
}
