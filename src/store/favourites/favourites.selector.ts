import { RootState } from '../store';

export const getFavourites = (state: RootState) => state.favourites.favourites;
export const getPages = (state: RootState) => state.favourites.pages;
