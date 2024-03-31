import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FAVOURITE_STATE_KEY, FavouritesState } from './favourites.state';
import { loadState } from '../storage';
import { authHost } from '../../http';
import { RootState } from '../store';
import { Recipe } from '../../core/Recipe';
import { LikedResponse } from '../../interfaces/LikedResponse.interface';

const initialState: FavouritesState = {
	favourites: loadState<Recipe[]>(FAVOURITE_STATE_KEY) ?? [],
	pages: 1,
};

export const addFavourite = createAsyncThunk<
	Recipe | undefined,
	{ recipeId: number },
	{ state: RootState }
>('/favourites/add', async (params, thunkApi) => {
	const access_token = thunkApi.getState().user.access_token;
	try {
		const { data } = await authHost.get<Recipe>(
			`/recipes/like/${params.recipeId}`,
			{
				headers: { Authorization: `Bearer ${access_token}` },
			}
		);
		return data;
	} catch (e) {}
});

export const removeFavourite = createAsyncThunk<
	LikedResponse | undefined,
	{ recipeId: number; limit?: number; page?: number },
	{ state: RootState }
>('/favourites/unlike', async (params, thunkApi) => {
	const access_token = thunkApi.getState().user.access_token;
	const { page, limit } = params;
	try {
		const { data } = await authHost.get<LikedResponse>(
			`/recipes/unlike/${params.recipeId}?page=${page}&limit=${limit}`,
			{
				headers: { Authorization: `Bearer ${access_token}` },
			}
		);
		return data;
	} catch (e) {}
});

export const loadFavourites = createAsyncThunk<
	LikedResponse,
	{ page?: number; limit?: number } | undefined,
	{ state: RootState }
>('/favourites', async (params, thunkApi) => {
	const access_token = await thunkApi.getState().user.access_token;
	if (params) {
		const { page, limit } = params;
		const { data } = await authHost.get<LikedResponse>(
			`/users/liked?page=${page}&limit=${limit}`,
			{
				headers: { Authorization: `Bearer ${access_token}` },
			}
		);
		return data;
	}
	const { data } = await authHost.get<LikedResponse>(`/users/liked`, {
		headers: { Authorization: `Bearer ${access_token}` },
	});
	return data;
});

export const favouritesSlice = createSlice({
	name: 'favourites',
	initialState,
	reducers: {
		addFavourite(state, action: PayloadAction<Recipe>) {
			if (!state.favourites) {
				return;
			}
			if (!action.payload) {
				return;
			}
			if (state.favourites.find((el) => el.id == action.payload.id)) {
				return;
			}
			state.favourites.push(action.payload);
		},
		removeFavourite(state, action: PayloadAction<number>) {
			state.favourites = state.favourites?.filter(
				(el) => el.id != action.payload
			);
		},
	},
	extraReducers: (builder) => {
		builder.addCase(addFavourite.fulfilled, (state, action) => {
			if (!action.payload) {
				return;
			}
			if (state.favourites.find((el) => el.id == action.payload?.id)) {
				return;
			}
			state.favourites.push(action.payload);
		});

		builder.addCase(removeFavourite.fulfilled, (state, action) => {
			if (!action.payload) {
				return;
			}
			state.favourites = action.payload.liked;
			state.pages = action.payload.total_pages;
		});

		builder.addCase(loadFavourites.fulfilled, (state, action) => {
			state.favourites = action.payload.liked;
			state.pages = action.payload.total_pages;
		});
		builder.addCase(loadFavourites.rejected, (state, action) => {
			state.favourites = [];
		});
	},
});

export default favouritesSlice.reducer;
export const favActions = favouritesSlice.actions;
