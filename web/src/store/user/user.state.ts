import { User } from '../../core/User';

export interface UserState {
	access_token?: string;
	isAuth: boolean;
	user?: User;
	loginError?: string;
	registerError?: string;
	resetError?: string;
	resetFinished: boolean;
	authPending: boolean;
}

export const TOKEN_KEY = 'token';
export const USER_STATE_KEY = 'user_state';
