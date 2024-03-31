import { InputProps } from './Input.props';
import cn from 'classnames';
import styles from './Input.module.css';
import { forwardRef } from 'react';

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
	{ className, valid = true, ...props },
	ref
) {
	return (
		<input
			{...props}
			ref={ref}
			className={cn(className, styles.input, {
				[styles.invalid]: !valid,
			})}
		></input>
	);
});
