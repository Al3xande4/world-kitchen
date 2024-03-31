import cn from 'classnames';
import { TextareaProps } from './Textarea.props';
import styles from './Textarea.module.css';

export function Textarea({ className, valid = true, ...props }: TextareaProps) {
	return (
		<textarea
			className={cn(styles.textarea, className, {
				[styles.invalid]: !valid,
			})}
			{...props}
		></textarea>
	);
}
