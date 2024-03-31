import { useCallback, useEffect, useRef } from 'react';

export function useDebounce<T extends (...args: any[]) => unknown>(
	fn: T,
	delay: number
) {
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const debouncedFn = useCallback(
		(...args: Parameters<T>) => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
			timeoutRef.current = setTimeout(() => {
				fn(...args);
			}, delay);
		},
		[fn, delay]
	);

	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	return debouncedFn;
}
