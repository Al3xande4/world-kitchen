import { useState } from 'react';
import IngredientSearch, {
	IngredientState,
} from '../IngredientSearch/IngredientSearch';
import styles from './IngredientsForm.module.css';
import { Input } from '../../ui/Input/Input';
import { Button } from '../../ui/Button/Button';
import { IngredientFormProps } from './IngredientsForm.props';
import { UnitSelector } from '../UnitSelector/UnitSelector';

export function IngredientsForm({ onAdd }: IngredientFormProps) {
	const [search, setSearch] = useState<IngredientState | null>(null);
	const [count, setCount] = useState(0);
	const [measure, setMeasure] = useState('');

	const handleAdd = () => {
		onAdd({
			title: search?.name,
			count,
			measure,
			imageUrl: `https://img.spoonacular.com/ingredients_100x100/${search?.image}`,
		});
		setCount(0);
		setMeasure('');
	};

	return (
		<div>
			<div className={styles.wrapper}>
				<IngredientSearch
					className={styles.search}
					setSelected={setSearch}
				/>
				<Input
					placeholder='Count'
					onChange={(e) => {
						setCount(+e.target.value);
					}}
					min={0}
					value={count == 0 ? '' : count}
					type='number'
					className={styles.count}
				/>
				<UnitSelector
					setUnit={setMeasure}
					units={
						search ? search.possibleUnits : ['g', 'kg', 'ml', 'l']
					}
					className={styles.measure}
				/>
			</div>
			<Button
				type='button'
				onClick={handleAdd}
				className={styles.btn}
				fillType='outlined'
			>
				Add Ingredient
			</Button>
		</div>
	);
}
