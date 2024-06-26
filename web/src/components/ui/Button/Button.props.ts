import { ButtonHTMLAttributes, ReactNode } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	children?: ReactNode;
	fillType?: 'outlined' | 'filled';
	size?: 'small' | 'big';
}
