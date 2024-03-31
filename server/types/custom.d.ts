declare namespace Express {
	export interface Request {
		userPayload: {
			email: string;
			id: number;
			isActivated: boolean;
		};
	}
}
