import { Header } from './Header/Header';
import { Outlet } from 'react-router-dom';
import styles from './Layout.module.css';

export function Layout() {
	return (
		<div className={styles.layout}>
			<Header className={styles.header} />
			<main className={styles.main}>
				<Outlet />
			</main>
			<footer />
		</div>
	);
}
