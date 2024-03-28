import { FavouriteItemProps } from './FavouriteItem.props';
import styles from './FavouriteItem.module.css';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store/store';
import cn from 'classnames';
import { removeFavourite } from '../../../store/favourites/favourites.slice';
import { memo, useState } from 'react';
import { Link } from 'react-router-dom';

function FavouriteItem({ recipe, page }: FavouriteItemProps) {
	const dispatch = useDispatch<AppDispatch>();
	const [hidden, setHidden] = useState(false);

	const handleFav = () => {
		setTimeout(() => {
			dispatch(removeFavourite({ recipeId: recipe.id, page, limit: 3 }));
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
			<button onClick={handleFav} className={cn(styles.favoutites)}>
				<svg
					className={cn(styles['fav-icon'])}
					width='11'
					height='11'
					viewBox='0 0 11 11'
					xmlns='http://www.w3.org/2000/svg'
				>
					<path d='M8.75095 10.0934L5.58045 8.42735L2.40873 10.0934L3.01588 6.56221L0.447662 4.062L3.99338 3.54714L5.58045 0.285568L7.16752 3.54714L10.7132 4.062L8.14502 6.56343L8.75095 10.0934Z' />
				</svg>
			</button>
		</div>
	);
}
export default memo(FavouriteItem);
