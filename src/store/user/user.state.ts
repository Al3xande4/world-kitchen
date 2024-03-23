import { User } from '../../interfaces/User';

export interface UserState {
	access_token?: string;
	isAuth: boolean;
	user?: User;
	loginError?: string;
	registerError?: string;
}

export const TOKEN_KEY = 'token';
export const USER_STATE_KEY = 'user_state';
