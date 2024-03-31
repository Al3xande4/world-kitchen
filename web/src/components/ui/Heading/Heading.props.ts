import { HTMLAttributes, ReactNode } from 'react';

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
	children?: ReactNode;
	type?: 'h1' | 'h2';
}
