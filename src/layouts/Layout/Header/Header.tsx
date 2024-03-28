import { NavLink } from 'react-router-dom';
import styles from './Header.module.css';
import cn from 'classnames';
import { Wrapper } from '../../../components/ui/Wrapper/Wrapper';
import { HeaderProps } from './Header.propts';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';
import { useEffect } from 'react';
import { checkAuth } from '../../../store/user/user.slice';

export function Header({ className }: HeaderProps) {
	const { access_token, user, isAuth } = useSelector(
		(state: RootState) => state.user
	);
	const dispatch = useDispatch<AppDispatch>();

	useEffect(() => {
		dispatch(checkAuth());
	}, [access_token]);

	return (
		<header className={cn(styles.header, className)}>
			<Wrapper className={styles.container}>
				<NavLink
					className={({ isActive }) =>
						cn(styles['link'], {
							[styles.active]: isActive,
						})
					}
					to={'/recipes'}
				>
					World Kitchen
				</NavLink>

				<img
					alt='Logo'
					src={'/logo.svg'}
					className={styles['logo-img']}
				></img>

				<nav className={styles.navigation}>
					{isAuth && (
						<NavLink
							to={'/account'}
							className={({ isActive }) =>
								cn(styles.account, {
									[styles.active]: isActive,
								})
							}
						>
							<img
								className={styles.profile}
								src='/profile.svg'
							></img>
							<div className={cn(styles.link, styles.greeting)}>
								{user?.username}
							</div>
						</NavLink>
					)}
					{!isAuth && (
						<>
							<NavLink
								to={'/auth/login'}
								className={({ isActive }) =>
									cn(styles.link, {
										[styles.active]: isActive,
									})
								}
							>
								Login
							</NavLink>
							<NavLink
								to={'/auth/register'}
								className={({ isActive }) =>
									cn(styles.link, {
										[styles.active]: isActive,
									})
								}
							>
								Register
							</NavLink>
						</>
					)}
				</nav>
			</Wrapper>
		</header>
	);
}
