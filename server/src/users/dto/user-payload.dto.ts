import { User } from '../user.entity';

export class UserPayload {
	email: string;
	id: number;
	isActivated: boolean;

	constructor(model: User) {
		this.email = model.email;
		this.id = model.id;
		this.isActivated = model.isActivated ?? false;
	}
}
