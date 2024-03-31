import { ButtonProps } from './Button.props';
import styles from './Button.module.css';
import cn from 'classnames';

export function Button({
	fillType,
	className,
	children,
	size = 'big',
	...props
}: ButtonProps) {
	return (
		<button
			{...props}
			className={cn(className, styles.button, {
				[styles.outlined]: fillType == 'outlined',
				[styles.filled]: fillType == 'filled',
				[styles.small]: size == 'small',
			})}
		>
			{children}
		</button>
	);
}
