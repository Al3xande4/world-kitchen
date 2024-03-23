import { Recipe } from '../../../interfaces/Recipe';

export interface RecipesListProps {
	recipes?: Recipe[] | null;
	className?: string;
}
