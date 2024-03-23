import { WrapperProps } from './Wrapper.props';
import cn from 'classnames';
import styles from './Wrapper.module.css';

export function Wrapper({ children, className }: WrapperProps) {
	return <div className={cn(className, styles.container)}>{children}</div>;
}
