import { memo } from 'react';
import { IngredientItemProps } from './IngredientItem.props';
import styles from './IngredientItem.module.css';

function IngredientItem({ ingredient }: IngredientItemProps) {
	return (
		<div className={styles.ingredient}>
			<img className={styles.img} src={ingredient.imageUrl}></img>
			<div className={styles.text}>
				<span>{ingredient.title}</span>
				{ingredient.count} {ingredient.measure}
			</div>
		</div>
	);
}

export default memo(IngredientItem);
