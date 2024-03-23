import { useCallback, useState } from 'react';
import { AxiosError } from 'axios';
import { host } from '../http';

export function useApi<T>(
	url: string,
	method: 'get' | 'post' | 'delete'
): [T | null, null | string, boolean, typeof getData] {
	const [data, setData] = useState<T | null>(null);
	const [error, setError] = useState<null | string>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const getData = useCallback(async () => {
		setIsLoading(true);
		setTimeout(async () => {
			try {
				const { data } = await host[method](`${url}`);
				setData(data);
				setIsLoading(false);
				setError(null);
			} catch (e) {
				if (e instanceof AxiosError) {
					setError(e.message);
					setIsLoading(false);
				}
			}
		}, 500);
	}, []);

	return [data, error, isLoading, getData];
}
