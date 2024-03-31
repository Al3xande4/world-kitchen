import { FC } from 'react';
import styles from './RecipeNewPage.module.css';
import { Wrapper } from '../../components/ui/Wrapper/Wrapper';
import RecipeForm from '../../components/domain/RecipeForm/RecipeForm';
import { Heading } from '../../components/ui/Heading/Heading';

export const RecipeNewPage: FC<{}> = () => {
	return (
		<div className={styles.page}>
			<Wrapper>
				<div className={styles['page-inner']}>
					<Heading className={styles.title}>Recipe</Heading>

					<RecipeForm />
				</div>
			</Wrapper>
		</div>
	);
};
