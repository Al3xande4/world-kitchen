import cn from 'classnames';
import styles from './RecipeItem.module.css';
import { RecipeItemProps } from './RecipeItem.props';
import { Tag } from '../../ui/Tag/Tag';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store/store';
import {
	MouseEvent,
	memo,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react';
import {
	addFavourite,
	favActions,
	removeFavourite,
} from '../../../store/favourites/favourites.slice';
import { useDebounce } from '../../../hooks/debounce.hook';

function RecipeItem({
	isFavourite = false,
	recipe,
	className,
	...props
}: RecipeItemProps) {
	const dispatch = useDispatch<AppDispatch>();
	const [isFav, setIsFav] = useState<boolean>(isFavourite);
	const [imgLoading, setImgLoading] = useState<boolean>(true);
	const ref = useRef<HTMLElement | null>(null);
	const offset = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((e) => {
					if (e.isIntersecting) {
						ref.current && ref.current.classList.add(styles.show);
						ref.current &&
							ref.current.classList.remove(styles.hidden);
					} else {
						ref.current &&
							ref.current.classList.remove(styles.show);
						ref.current && ref.current.classList.add(styles.hidden);
					}
				});
			},
			{ root: null }
		);
		if (ref.current) {
			observer.observe(ref.current);
		}
		if (offset.current) {
			observer.observe(offset.current);
		}
		return () => {
			ref.current && observer.unobserve(ref.current);
			offset.current && observer.unobserve(offset.current);
		};
	}, [ref, offset]);

	const toggleFav = useDebounce((e: MouseEvent) => {
		e.preventDefault();
		if (isFav) {
			dispatch(removeFavourite({ recipeId: recipe.id }));
		} else {
			dispatch(addFavourite({ recipeId: recipe.id }));
		}
		setIsFav((prev) => !prev);
	}, 100);
	return (
		<article
			ref={ref}
			{...props}
			className={cn(className, styles.recipe, styles.hidden)}
		>
			<div className={styles.offset} ref={offset}></div>
			<div className={styles.preview}>
				<button
					onClick={toggleFav}
					className={cn(styles.favoutites, {
						[styles.fav]: isFav,
					})}
				>
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
				<img
					className={cn(styles.img, {
						[styles.hidden]: imgLoading,
					})}
					onLoad={() => {
						setImgLoading(false);
					}}
					src={recipe.photoUrl}
					alt='Recipe preview'
				></img>
				<Tag className={styles.rating}>
					<span>{recipe.rating ?? 0}</span>
					<img src='./star-icon.svg' alt='Star icon'></img>
				</Tag>
			</div>
			<h3 className={styles.title}>{recipe.title}</h3>
			<p className={styles.desc}>{recipe.about}</p>
		</article>
	);
}

export default memo(RecipeItem);
