import cn from 'classnames';
import styles from './Tag.module.css';
import { TagProps } from './Tag.props';
export function Tag({ children, className }: TagProps) {
	return <div className={cn(styles.tag, className)}>{children}</div>;
}
