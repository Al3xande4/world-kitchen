import styles from './Favourite.module.css';
import { useDispatch, useSelector } from 'react-redux';
import {
	getFavourites,
	getPages,
} from '../../../store/favourites/favourites.selector';
import FavouriteItem from '../FavouriteItem/FavouriteItem';
import { AppDispatch, RootState } from '../../../store/store';
import { useCallback, useEffect, useState } from 'react';
import { loadFavourites } from '../../../store/favourites/favourites.slice';
import { Button } from '../../ui/Button/Button';
import cn from 'classnames';

export function FavouriteList() {
	const favourites = useSelector(getFavourites);
	const pages = useSelector(getPages);
	const dispatch = useDispatch<AppDispatch>();
	const [page, setPage] = useState(1);
	const { access_token } = useSelector((state: RootState) => state.user);

	useEffect(() => {
		dispatch(loadFavourites({ page: page, limit: 3 }));
	}, [page]);

	useEffect(() => {
		if (favourites.length === 0) {
			setPage((prev) => Math.max(1, prev - 1));
		}
	}, [favourites, setPage]);

	const pageBack = () => {
		if (page == 1) {
			return;
		}
		setPage((prev) => Math.max(1, prev - 1));
	};

	const pageForward = useCallback(() => {
		if (page == pages || !pages) {
			return;
		}
		setPage((prev) => Math.min(pages, prev + 1));
	}, [page, pages, setPage]);

	return (
		<div className={styles.wrapper}>
			<ul className={styles.list}>
				{favourites.map((el) => (
					<li key={el.id}>
						<FavouriteItem page={page} key={el.id} recipe={el} />
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
						[styles.hidden]: page == pages,
					})}
					size='small'
					fillType='filled'
					onClick={pageForward}
				>
					<img src='/arrow-right.svg'></img>
				</Button>
			</div>
		</div>
	);
}
