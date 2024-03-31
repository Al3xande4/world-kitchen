import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserRestoreDto {
	@IsNotEmpty()
	@IsEmail()
	email: string;
}
