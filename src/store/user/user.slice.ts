import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { USER_STATE_KEY, UserState } from './user.state';
import { loadState } from '../storage';
import { host } from '../../http';
import { LoginResponse } from '../../interfaces/LoginResponse.interface';
import { RegisterResponse } from '../../interfaces/RegisterResponse.interface';
import { AxiosError } from 'axios';

const initialState: UserState = loadState<UserState>(USER_STATE_KEY) ?? {
	isAuth: false,
};

export const login = createAsyncThunk(
	'user/login',
	async (params: { email: string; password: string }) => {
		try {
			const { data } = await host.post<LoginResponse>(
				'/users/login',
				{
					email: params.email,
					password: params.password,
				},
				{ withCredentials: true }
			);
			return data;
		} catch (e) {
			if (e instanceof AxiosError) {
				throw new Error(e.response?.data.message);
			}
		}
	}
);

export const register = createAsyncThunk(
	'user/register',
	async (params: { email: string; password: string; username: string }) => {
		try {
			const { data } = await host.post<RegisterResponse>(
				'/users/register',
				{
					...params,
				}
			);
			return data;
		} catch (e) {
			if (e instanceof AxiosError) {
				throw new Error(e.response?.data.message);
			}
		}
	}
);

export const logout = createAsyncThunk('user/logout', async () => {
	const { data } = await host.get('/users/logout', { withCredentials: true });
	return data;
});

export const checkAuth = createAsyncThunk('user/checkAuth', async () => {
	const { data } = await host.get<LoginResponse>('/users/refresh', {
		withCredentials: true,
	});
	return data;
});

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		clearState: (state) => {
			state.access_token = undefined;
			state.isAuth = false;
			state.loginError = undefined;
			state.registerError = undefined;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(login.fulfilled, (state, action) => {
			if (!action.payload) {
				return;
			}
			state.access_token = action.payload.access_token;
			state.user = action.payload.user;
			state.isAuth = true;
		});

		builder.addCase(login.rejected, (state, action) => {
			state.loginError = action.error.message;
		});

		builder.addCase(register.fulfilled, (state, action) => {
			if (!action.payload) {
				return;
			}
			state.access_token = action.payload.access_token;
			state.user = action.payload.user;
			state.isAuth = true;
		});

		builder.addCase(register.rejected, (state, action) => {
			state.registerError = action.error.message;
		});

		builder.addCase(checkAuth.fulfilled, (state, action) => {
			state.access_token = action.payload.access_token;
			state.isAuth = true;
			state.user = action.payload.user;
			state.loginError = undefined;
			state.registerError = undefined;
		});

		builder.addCase(checkAuth.rejected, (state) => {
			state.isAuth = false;
			state.access_token = undefined;
			state.user = undefined;
		});

		builder.addCase(logout.fulfilled, (state) => {
			state.isAuth = false;
			state.access_token = undefined;
			state.user = undefined;
		});
	},
});

export default userSlice.reducer;
export const userActions = userSlice.actions;
