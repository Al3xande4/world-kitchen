import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { Heading } from '../../components/ui/Heading/Heading';
import cn from 'classnames';
import styles from './AccountLayout.module.css';
import { Wrapper } from '../../components/ui/Wrapper/Wrapper';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { userActions } from '../../store/user/user.slice';

export enum TABS {
	Default = '/account/',
	Details = '/account/details',
	Logout = '/account/logout',
}

export function AccountLayout() {
	const { user } = useSelector((state: RootState) => state.user);
	const navigate = useNavigate();
	const dispatch = useDispatch<AppDispatch>();
	const location = useLocation();
	console.log(location);

	useEffect(() => {
		if (!user) {
			navigate('/');
		}
	}, []);

	return (
		<div className={styles.account}>
			{location.pathname}
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
										navigate(TABS.Default);
									}}
									role='tab'
									type='button'
									className={cn(styles.tab, {
										[styles.active]:
											location.pathname == TABS.Default,
									})}
								>
									Order History
								</button>
							</li>

							<li className={styles['nav-item']}>
								<button
									onClick={() => {
										navigate(TABS.Details);
									}}
									role='tab'
									type='button'
									className={cn(styles.tab, {
										[styles.active]:
											TABS.Details == location.pathname,
									})}
								>
									My Profile
								</button>
							</li>

							<li className={styles['nav-item']}>
								<button
									onClick={() => {
										navigate(TABS.Logout);
									}}
									role='tab'
									type='button'
									className={styles.tab}
								>
									Log Out
								</button>
							</li>
						</ul>
					</div>

					<Outlet />
				</div>
			</Wrapper>
		</div>
	);
}
