import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FAVOURITE_STATE_KEY, FavouritesState } from './favourites.state';
import { loadState } from '../storage';

const initialState: FavouritesState = {
	favourites: loadState<number[]>(FAVOURITE_STATE_KEY) ?? [],
};

export const favouritesSlice = createSlice({
	name: 'favourites',
	initialState,
	reducers: {
		addFavourite(state, action: PayloadAction<number>) {
			if (!state.favourites) {
				return;
			}
			if (state.favourites.includes(action.payload)) {
				return;
			}
			state.favourites.push(action.payload);
		},
		removeFavourite(state, action: PayloadAction<number>) {
			state.favourites = state.favourites?.filter(
				(el) => el != action.payload
			);
		},
	},
});

export default favouritesSlice.reducer;
export const favActions = favouritesSlice.actions;
