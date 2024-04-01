import axios from 'axios';
import { loadState, saveState } from '../store/storage';
import { USER_STATE_KEY, UserState } from '../store/user/user.state';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth, userActions } from '../store/user/user.slice';
import { AppDispatch, RootState } from '../store/store';

export const host = axios.create({ baseURL: 'http://localhost:3000' });
export const authHost = axios.create({
	baseURL: 'http://localhost:3000',
	withCredentials: true,
});

authHost.interceptors.request.use((config) => {
	const token = loadState<{ access_token: string }>('token')?.access_token;
	config.headers.Authorization = `Bearer ${token}`;
	return config;
});

authHost.interceptors.response.use(
	(config) => config,
	async (error) => {
		const originalRequest = error.config;
		if (originalRequest && !originalRequest._isRetry) {
			originalRequest._isRetry = true;
			console.log(originalRequest)
			const { data } = await axios.get(
				'http://localhost:3000/users/refresh',
				{
					withCredentials: true,
				}
			);
			saveState('token', {
				access_token: data.access_token,
			});
			return host.request(originalRequest);
		}
		throw error;
	}
);
