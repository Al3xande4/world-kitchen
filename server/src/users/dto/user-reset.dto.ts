import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserResetDto {
	@IsNotEmpty()
	newPass: string;
}
