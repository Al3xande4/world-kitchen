import styles from './Loader.module.css';
import { LoaderProps } from './Loader.props';
import cn from 'classnames';

export function Loader({ className, size = 'small' }: LoaderProps) {
	return (
		<div
			className={cn(className, styles.wrapper, {
				[styles.big]: size == 'big',
			})}
		>
			<div className={styles.inner}></div>
		</div>
	);
}
