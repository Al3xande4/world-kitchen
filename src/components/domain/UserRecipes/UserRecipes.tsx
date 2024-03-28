import { Link } from 'react-router-dom';
import { Button } from '../../ui/Button/Button';
import styles from './UserRecipes.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';
import { useEffect, useState } from 'react';
import UserRecipeItem from '../UserRecipeItem/UserRecipeItem';
import cn from 'classnames';
import { loadUserRecipes } from '../../../store/user-recipes/user-recipes.slice';

export function UserRecipes() {
	const { recipes, total_pages } = useSelector(
		(state: RootState) => state.userRecipes
	);
	const dispatch = useDispatch<AppDispatch>();
	const [page, setPage] = useState(1);

	const pageBack = () => {
		setPage((prev) => Math.max(1, prev - 1));
	};

	const pageForward = () => {
		if (!recipes) {
			return;
		}
		setPage((prev) => Math.min(prev + 1, total_pages));
	};

	useEffect(() => {
		dispatch(loadUserRecipes({ page, limit: 3 }));
	}, [page]);

	useEffect(() => {
		dispatch(loadUserRecipes({ page, limit: 3 }));
		if (recipes.length == 0) {
			setPage((prev) => Math.max(1, prev - 1));
		}
	}, [recipes.length]);
	return (
		<>
			{recipes?.length && (
				<div className={styles.wrapper}>
					<ul className={styles.list}>
						{recipes.map((el) => (
							<li key={el.id}>
								<UserRecipeItem page={page} recipe={el} />
							</li>
						))}
					</ul>
					<div className={styles['page-controll']}>
						<Button
							className={cn(styles.btn, {
								[styles.hidden]: page == 1,
							})}
							size='small'
							fillType='filled'
							onClick={pageBack}
						>
							-
						</Button>
						<p className={styles['page-count']}>{page}</p>
						<Button
							className={cn(styles.btn, {
								[styles.hidden]: page == total_pages,
							})}
							size='small'
							fillType='filled'
							onClick={pageForward}
						>
							<img src='/arrow-right.svg'></img>
						</Button>
					</div>
				</div>
			)}
			{recipes.length == 0 && (
				<section className={styles['recipes-error']}>
					<h3 className={styles.title}>My Recipes</h3>
					<p className={styles.text}>
						You haven't made any recipes yet.
					</p>
					<Link to={'/recipes/create'}>
						<Button fillType='filled'>Create Now</Button>
					</Link>
				</section>
			)}
		</>
	);
}
