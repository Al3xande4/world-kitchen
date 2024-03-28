import { Recipe } from '../../core/Recipe';

export interface FavouritesState {
	favourites: Recipe[];
	pages: number;
}

export const FAVOURITE_STATE_KEY = 'fav_key';
