import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UserRegisterDto {
	@IsString({ message: 'username is not valid' })
	@IsNotEmpty({ message: 'username is empty' })
	@MaxLength(20)
	username: string;

	@IsString({ message: 'password is not valid' })
	@IsNotEmpty({ message: 'password is empty' })
	password: string;

	@IsString({ message: 'username is not valid' })
	@IsNotEmpty({ message: 'username is empty' })
	@IsEmail()
	email: string;

	twitter?: string;
	instagram?: string;

	about?: string;
}
