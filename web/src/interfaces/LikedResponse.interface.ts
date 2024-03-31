import { Recipe } from '../core/Recipe';

export interface LikedResponse {
	liked: Recipe[];
	total_pages: number;
}
