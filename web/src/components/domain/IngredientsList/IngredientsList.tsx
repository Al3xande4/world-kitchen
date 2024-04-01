import IngredientItem from '../IngredientItem/IngredientItem';
import { IngredientListProps } from './IngredientsList.props';
import styles from './IngredientsList.module.css';

export function IngredientsList({ ingredients }: IngredientListProps) {
	if (!ingredients) {
		return;
	}
	return (
		<>
			<h3 className={styles.title}>What you will need:</h3>
			<ul className={styles.ingredients}>
				{ingredients.map((el, index) => (
					<IngredientItem key={index} ingredient={el} />
				))}
			</ul>
		</>
	);
}
