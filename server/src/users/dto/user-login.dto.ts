import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserLoginDto {
	@IsString({ message: 'password is not valid' })
	@IsNotEmpty({ message: 'password is empty' })
	password: string;

	@IsString({ message: 'username is not valid' })
	@IsNotEmpty({ message: 'username is empty' })
	@IsEmail({})
	email: string;
}
