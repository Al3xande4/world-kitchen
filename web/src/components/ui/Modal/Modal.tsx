import { ModalProps } from './Modal.props';
import cn from 'classnames';
import styles from './Modal.module.css';

export function Modal({ children, className }: ModalProps) {
	return <div className={cn(className, styles.modal)}>{children}</div>;
}
