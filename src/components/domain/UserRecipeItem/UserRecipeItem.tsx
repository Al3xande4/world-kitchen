import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store/store';
import { memo, useEffect, useState } from 'react';
import styles from './UserRecipeItem.module.css';
import { UserRecipeItemProps } from './UserRecipeItem.props';
import cn from 'classnames';
import { Link } from 'react-router-dom';
import {
	deletUserRecipe,
	loadUserRecipes,
} from '../../../store/user-recipes/user-recipes.slice';

function UserRecipeItem({ recipe, page }: UserRecipeItemProps) {
	const dispatch = useDispatch<AppDispatch>();
	const [hidden, setHidden] = useState(false);

	useEffect(() => {}, []);

	const deleteRecipe = async () => {
		setTimeout(() => {
			dispatch(deletUserRecipe({ id: recipe.id }));
			dispatch(loadUserRecipes({ page, limit: 3 }));
		}, 1000);
		setHidden(true);
	};

	return (
		<div
			className={cn(styles.recipe, {
				[styles.hidden]: hidden,
			})}
		>
			<Link to={`/recipes/${recipe.id}`}>
				<img
					className={styles['recipe-image']}
					src={recipe.photoUrl}
				></img>
			</Link>
			<h3 className={styles.title}>{recipe.title}</h3>
			<button onClick={deleteRecipe} className={cn(styles.delete)}>
				<img src='/trash-can-svgrepo-com.svg'></img>
			</button>

			<button className={cn(styles.change)}>
				<img src='/pencil-edit-svgrepo-com.svg'></img>
			</button>
		</div>
	);
}
export default memo(UserRecipeItem);
