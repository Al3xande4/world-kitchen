import { RecipesListProps } from './RecipeList.props';
import cn from 'classnames';
import styles from './Recipe.module.css';
import { useSelector } from 'react-redux';
import { getFavourites } from '../../../store/favourites/favourites.selector';
import RecipeItem from '../RecipeItem/RecipeItem';

export function RecipesList({ recipes, className }: RecipesListProps) {
	if (!recipes || recipes.length == 0) {
		return <div>No items</div>;
	}
	const fav = useSelector(getFavourites);
	return (
		<ul className={cn(styles.list, className)}>
			{recipes.map((el) => (
				<RecipeItem
					className={styles.item}
					isFavourite={fav?.includes(el.id)}
					recipe={el}
					key={el.id}
				/>
			))}
		</ul>
	);
}
