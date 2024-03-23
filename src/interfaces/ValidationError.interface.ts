export interface ValidationError {
	property: string;
	constraints: {
		isNotEmpty: string;
		isEmail: string;
	};
}

export interface GeneralError {
	error: string;
}
