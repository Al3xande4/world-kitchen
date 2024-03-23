import styles from './Loader.module.css';
import { LoaderProps } from './Loader.props';
import cn from 'classnames';

export function Loader({ size = 'small' }: LoaderProps) {
	return (
		<div
			className={cn(styles.wrapper, {
				[styles.big]: size == 'big',
			})}
		>
			<div className={styles.inner}></div>
		</div>
	);
}
