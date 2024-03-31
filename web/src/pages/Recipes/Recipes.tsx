import { useEffect, useState } from 'react';
import { Heading } from '../../components/ui/Heading/Heading';
import { Wrapper } from '../../components/ui/Wrapper/Wrapper';
import styles from './Recipes.module.css';
import { Recipe } from '../../core/Recipe';
import { useApi } from '../../hooks/api.hook';
import { RecipesList } from '../../components/domain/RecipesList/RecipesList';
import { Loader } from '../../components/ui/Loader/Loader';
import { Parallax, ParallaxLayer } from '@react-spring/parallax';
import { loadFavourites } from '../../store/favourites/favourites.slice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';

export function RecipesPage() {
	const [scroll, setScroll] = useState(0);
	const dispatch = useDispatch<AppDispatch>();
	const [recipes, error, isLoading, getRecipes] = useApi<Recipe[]>(
		'recipes',
		'get'
	);

	useEffect(() => {
		getRecipes();
	}, [getRecipes]);

	useEffect(() => {
		dispatch(loadFavourites());
	}, [loadFavourites]);

	useEffect(() => {
		const handleScroll = () => {
			setScroll(window.scrollY);
		};

		window.addEventListener('scroll', handleScroll);

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	return (
		<div className={styles.page}>
			<section
				className={styles.promo}
				style={{
					backgroundPositionY:
						scroll == 0
							? 'center'
							: `calc(50% + ${
									((scroll * 0.5) / window.innerHeight) * 100
							  }%)`,
				}}
			>
				<Wrapper>
					<div className={styles['promo__inner']}>
						<Heading type='h1'>Home kitchen for everyone</Heading>
						<p className={styles['promo__text']}>
							Website for everyone who wants to share recipies
							with others, and try something new...
						</p>
					</div>
				</Wrapper>
				<svg
					className={styles.wave}
					width='1440'
					height='41'
					viewBox='0 0 1440 41'
					xmlns='http://www.w3.org/2000/svg'
					preserveAspectRatio='none'
				>
					<path d='M838.851 14.0506C850.593 16.373 861.678 18.8791 872.675 21.3652C894.93 26.3963 916.822 31.3453 943.048 34.5219C952.635 35.6834 962.496 36.8781 970.033 37.7021C978.468 38.5456 986.834 39.2418 994.238 39.6123C1003.91 40.0961 1012.22 40.3684 1019.79 40.4415C1027.36 40.3684 1035.68 40.0961 1045.34 39.6123C1052.75 39.2418 1061.11 38.5456 1069.55 37.7021C1077.09 36.878 1086.94 35.6836 1096.53 34.5219C1122.76 31.3453 1144.65 26.3964 1166.91 21.3651C1185.31 17.2042 1216.88 10.9464 1238.44 7.62865C1234.45 8.26882 1243.12 6.90855 1238.44 7.62865C1253.2 5.26153 1264.53 3.4425 1282.05 2.18342C1308.77 0.262829 1323.96 0.615971 1350.71 2.18342C1371.12 3.37939 1382.53 4.72263 1402.72 7.57317C1417.17 9.61211 1428.85 11.9874 1440 14.5324L1439.94 40.8721H0L0.0596975 14.7182C11.2124 12.1732 23.3928 9.61212 37.8348 7.57317C58.0253 4.72263 69.4375 3.37939 89.8492 2.18342C116.601 0.615971 131.788 0.262829 158.508 2.18342C176.025 3.4425 187.369 5.26231 202.125 7.62944C197.447 6.90967 206.113 8.26935 202.125 7.62944C223.687 10.9472 255.248 17.2042 273.653 21.3652C295.908 26.3963 317.8 31.3453 344.026 34.5219L345.636 34.7169C355.222 35.8783 363.474 36.8781 371.011 37.7021C379.446 38.5456 387.812 39.2418 395.216 39.6123C404.884 40.0961 413.201 40.3684 420.769 40.4415C428.336 40.3684 436.654 40.0961 446.321 39.6123C453.725 39.2418 462.092 38.5456 470.527 37.7021C478.064 36.878 486.313 35.8786 495.902 34.7169L497.511 34.5219C523.738 31.3453 545.629 26.3964 567.884 21.3651C578.882 18.879 589.968 16.3727 601.711 14.0501C612.227 11.6874 623.331 9.48278 636.857 7.57317C644.846 6.44515 651.461 5.5532 657.804 4.81297C665.4 3.76339 673.252 2.88618 683.03 2.18342C697.635 1.13364 708.794 0.763176 720.28 0.899005C731.766 0.763176 742.925 1.13364 757.53 2.18342C767.307 2.88616 775.159 3.76329 782.755 4.81283C789.097 5.55308 795.713 6.44509 803.703 7.57317C817.23 9.48289 828.334 11.6876 838.851 14.0506Z'></path>
				</svg>
			</section>
			<section className={styles.recipes}>
				<Wrapper>
					<div className={styles['recipes__inner']}>
						<Heading type='h2' className={styles['recipes-title']}>
							Find the recipe what YOU want
						</Heading>
						{isLoading && <Loader />}
						{error && <div className={styles.error}>{error}</div>}
						{!isLoading && !error && (
							<RecipesList recipes={recipes} />
						)}
					</div>
				</Wrapper>
			</section>
		</div>
	);
}

export default RecipesPage;
