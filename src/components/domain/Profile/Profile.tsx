import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import styles from './Profile.module.css';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import cn from 'classnames';

export function Profile() {
	const { user } = useSelector((state: RootState) => state.user);
	const navigate = useNavigate();

	useEffect(() => {
		if (!user) {
			navigate('/');
		}
	}, []);

	return (
		<section className={styles.profile}>
			<div className={styles.row}>
				<h2 className={styles.title}>Account Details</h2>

				<div className={cn(styles.card, styles['email-section'])}>
					<h3 className={styles['title-info']}>Email</h3>
					<p className={styles['email']}>{user?.email}</p>
					<a
						href='mailto:a06794161@gmail.com?subject=Change%20My%20Email%20Address'
						className={styles['link']}
					>
						Contact Us to Change Email
					</a>
				</div>

				<div className={styles.card}>
					<h3 className={styles['title-info']}>Password</h3>
					<p className={styles['password']}>••••••••••</p>
					<Link to={'/auth/login#recover'} className={styles['link']}>
						Change My password
					</Link>
				</div>
			</div>
		</section>
	);
}
