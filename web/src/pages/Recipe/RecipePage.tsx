import { useParams } from 'react-router-dom';
import { Wrapper } from '../../components/ui/Wrapper/Wrapper';
import { useApi } from '../../hooks/api.hook';
import { Recipe } from '../../core/Recipe';
import { useEffect } from 'react';
import { Loader } from '../../components/ui/Loader/Loader';
import styles from './RecipesPage.module.css';
import { Heading } from '../../components/ui/Heading/Heading';
import { StepList } from '../../components/domain/StepList/StepList';
import { IngredientsList } from '../../components/domain/IngredientsList/IngredientsList';

export function RecipePage() {
	const { id } = useParams();
	const [recipe, error, isLoading, getRecipe] = useApi<Recipe>(
		`/recipes/${id}`,
		'get'
	);

	useEffect(() => {
		getRecipe();
	}, []);

	return (
		<div className={styles['recipe-section']}>
			<Wrapper>
				{error && <div>Network error</div>}
				{isLoading && <Loader />}
				{!isLoading && recipe && (
					<div className={styles['recipe__inner']}>
						<img
							className={styles.preview}
							src={recipe.photoUrl}
						></img>
						<Heading className={styles.title}>
							{recipe.title}
						</Heading>
						<p className={styles.description}>{recipe.recipe}</p>
						<IngredientsList ingredients={recipe.ingredients} />
						<StepList steps={recipe.steps} />
					</div>
				)}
			</Wrapper>
		</div>
	);
}
