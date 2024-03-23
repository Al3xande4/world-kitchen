export function loadState<T>(key: string): T | null {
	const data = localStorage.getItem(key);
	if (!data) {
		return null;
	}
	return JSON.parse(data) as T;
}

export function saveState<T>(key: string, state: T) {
	localStorage.setItem(key, JSON.stringify(state));
}
