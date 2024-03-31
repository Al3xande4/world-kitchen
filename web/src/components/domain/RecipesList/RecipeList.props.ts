import { Recipe } from '../../../core/Recipe';

export interface RecipesListProps {
	recipes?: Recipe[] | null;
	className?: string;
}
