import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { UserRecipesState } from './user-recipes.stata';
import { authHost } from '../../http';
import { UserRecipesResponse } from '../../interfaces/UserRecipesResponse.interface';

const initialState: UserRecipesState = {
	recipes: [],
	total_pages: 0,
};

export const loadUserRecipes = createAsyncThunk(
	'user-recipes/load',
	async (params: { page?: number; limit?: number } | undefined) => {
		try {
			if (params) {
				const { page, limit } = params;
				const { data } = await authHost.get<UserRecipesResponse>(
					`/users/recipes?page=${page}&limit=${limit}`
				);
				return data;
			}
			const { data } = await authHost.get<UserRecipesResponse>(
				'/users/recipes'
			);
			return data;
		} catch (e) {}
	}
);

export const deletUserRecipe = createAsyncThunk(
	'user-recipes/delete',
	async (params: { id: number }) => {
		try {
			const { } = await authHost.delete(`/recipes/${params.id}`);
			return params.id;
		} catch (e) {}
	}
);

const userRecipesSlice = createSlice({
	name: 'user-recipes',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(loadUserRecipes.fulfilled, (state, action) => {
			if (!action.payload) {
				return;
			}
			state.recipes = action.payload.recipes;
			state.total_pages = action.payload.total;
		});
		builder.addCase(deletUserRecipe.fulfilled, (state, action) => {
			if (!action.payload) {
				return;
			}
			state.recipes = state.recipes.filter(
				(el) => el.id != action.payload
			);
		});
	},
});

export default userRecipesSlice.reducer;
export const userRecipesActions = userRecipesSlice.actions;
