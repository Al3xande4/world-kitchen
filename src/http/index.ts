import axios from 'axios';
import { loadState, saveState } from '../store/storage';
import { USER_STATE_KEY, UserState } from '../store/user/user.state';

export const host = axios.create({ baseURL: 'http://localhost:3000' });
export const authHost = axios.create({
	baseURL: 'http://localhost:3000',
	withCredentials: true,
});

authHost.interceptors.request.use((config) => {
	const token = loadState<UserState>(USER_STATE_KEY)?.access_token;
	config.headers.Authorization = `Bearer ${token}`;
	return config;
});

authHost.interceptors.response.use(
	(config) => config,
	async (error) => {
		const originalRequest = error.config;
		if (
			error.response.status == 401 &&
			originalRequest &&
			!originalRequest._isRetry
		) {
			originalRequest._isRetry = true;
			const response = await axios.get(
				'http://localhost:3000/users/refresh',
				{
					withCredentials: true,
				}
			);
			saveState('token', response);
			return host.request(originalRequest);
		}
		throw error;
	}
);
