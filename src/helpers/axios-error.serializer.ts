import { AxiosError } from 'axios';

export class SerializedAxiosError {
	constructor(public status: number | undefined, public data: any) {}
}

export const axiosErrorSerializer = (error: any) => {
	if (error instanceof AxiosError) {
		// Serialize the AxiosError object to a plain object
		return new SerializedAxiosError(
			error.response?.status,
			error.response?.data
		);
	}
	// Return the original value if it's not an AxiosError
	return error;
};
