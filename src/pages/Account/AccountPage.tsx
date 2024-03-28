import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { Heading } from '../../components/ui/Heading/Heading';
import cn from 'classnames';
import styles from './AccountPage.module.css';
import { Wrapper } from '../../components/ui/Wrapper/Wrapper';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Logout } from '../../components/domain/Logout/Logout';
import { UserRecipes } from '../../components/domain/UserRecipes/UserRecipes';
import { Profile } from '../../components/domain/Profile/Profile';
import { FavouriteList } from '../../components/domain/FavouriteList/FavouriteList';

export enum TABS {
	Default = '/account',
	Details = '/account/details',
	Favourite = '/account/favourite',
	Logout = '/account/logout',
}

const TabElements = {
	[TABS.Default]: <UserRecipes />,
	[TABS.Details]: <Profile />,
	[TABS.Favourite]: <FavouriteList />,
	[TABS.Logout]: <Logout />,
};

export function AccountPage() {
	const { user } = useSelector((state: RootState) => state.user);
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const [tab, setTab] = useState<TABS>(pathname as TABS);

	useEffect(() => {
		if (!user) {
			navigate('/');
		}
	}, []);

	useEffect(() => {
		if (tab != pathname) {
			navigate(tab);
		}
	}, [tab]);

	return (
		<div className={styles.account}>
			<Wrapper>
				<div className={styles['account-inner']}>
					<Heading className={styles.title}>My Account</Heading>

					<p className={styles.greeting}>
						Welcome back, {user?.username}
					</p>

					<div className={styles.actions}>
						<ul role='tablist' className={styles['nav-list']}>
							<li className={styles['nav-item']}>
								<button
									onClick={() => {
										setTab(TABS.Default);
									}}
									role='tab'
									type='button'
									className={cn(styles['tab-btn'], {
										[styles.active]: tab == TABS.Default,
									})}
								>
									My Recipes
								</button>
							</li>

							<li className={styles['nav-item']}>
								<button
									onClick={() => {
										setTab(TABS.Details);
									}}
									role='tab'
									type='button'
									className={cn(styles['tab-btn'], {
										[styles.active]: TABS.Details == tab,
									})}
								>
									My Profile
								</button>
							</li>

							<li className={styles['nav-item']}>
								<button
									onClick={() => {
										setTab(TABS.Favourite);
									}}
									role='tab'
									type='button'
									className={cn(styles['tab-btn'], {
										[styles.active]: TABS.Favourite == tab,
									})}
								>
									Favourite
								</button>
							</li>

							<li className={styles['nav-item']}>
								<button
									onClick={() => {
										setTab(TABS.Logout);
									}}
									role='tab'
									type='button'
									className={styles['tab-btn']}
								>
									Log Out
								</button>
							</li>
						</ul>
						<div className={styles.tab}>{TabElements[tab]}</div>
					</div>
				</div>
			</Wrapper>
		</div>
	);
}
