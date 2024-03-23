import { HeadingProps } from './Heading.props';
import styles from './Heading.module.css';
import cn from 'classnames';

export function Heading({
	type = 'h1',
	className,
	children,
	...props
}: HeadingProps) {
	switch (type) {
		case 'h1':
			return (
				<h1 {...props} className={cn(styles.h1, className)}>
					{children}
				</h1>
			);
		case 'h2':
			return (
				<h2 {...props} className={cn(styles.h2, className)}>
					{children}
				</h2>
			);
	}
}
