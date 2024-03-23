import { RootState } from '../store';

export const getFavourites = (state: RootState) => state.favourites.favourites;
