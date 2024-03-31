import { LabelProps } from './Label.props';
import cn from 'classnames';
import styles from './Label.module.css';

export function Label({ className, children, ...props }: LabelProps) {
	return (
		<label {...props} className={cn(className, styles.label)}>
			{children}
		</label>
	);
}
