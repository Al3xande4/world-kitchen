import { configureStore } from '@reduxjs/toolkit';
import favouritesSlice from './favourites/favourites.slice';
import { saveState } from './storage';
import { FAVOURITE_STATE_KEY } from './favourites/favourites.state';
import userSlice from './user/user.slice';
import { USER_STATE_KEY } from './user/user.state';

export const store = configureStore({
	reducer: {
		favourites: favouritesSlice,
		user: userSlice,
	},
});

store.subscribe(() => {
	saveState(FAVOURITE_STATE_KEY, store.getState().favourites.favourites);
	saveState(USER_STATE_KEY, store.getState().user);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
