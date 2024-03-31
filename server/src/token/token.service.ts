import { id, inject, injectable } from 'inversify';
import { GenerateTokenReturn, ITokenService } from './token.service.interface';
import jwt from 'jsonwebtoken';
import { TYPES } from '../types';
import { IConfigService } from '../config/config.service.interface';
import { Token } from './token.entity';
import { User } from '../users/user.entity';
import { IUserService } from '../users/user.service.interface';
import { IUserRepository } from '../users/user.repository.interface';
import { HttpExeption } from '../errors/http-error';
import { UserPayload } from '../users/dto/user-payload.dto';
@injectable()
export class TokenService implements ITokenService {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.UsersRepository) private userRepository: IUserRepository
	) {}

	async generateToken(payload: any): Promise<GenerateTokenReturn> {
		const accessToken = await jwt.sign(
			payload,
			this.configService.get('ACCESS_TOKEN'),
			{ expiresIn: '30m' }
		);
		const refreshToken = jwt.sign(
			payload,
			this.configService.get('REFRESH_TOKEN'),
			{ expiresIn: '30d' }
		);
		return {
			accessToken,
			refreshToken,
		};
	}

	async saveToken(userId: number, refreshToken: string): Promise<Token> {
		const existedToken = await Token.findOne({
			where: { user: { id: userId } },
		});
		if (existedToken) {
			existedToken.refreshToken = refreshToken;
			return existedToken.save();
		}
		const user = await this.userRepository.findBy({ id: userId });
		if (!user) {
			throw new HttpExeption('No such user with', 404);
		}
		const token = await Token.create({
			user,
			refreshToken,
		}).save();

		return token;
	}

	async removeToken(refreshToken: string): Promise<Token | undefined> {
		const token = await Token.findOne({
			relations: {
				user: true,
			},
			where: { refreshToken },
		});
		return await token?.remove();
	}

	async validateAccessToken(token: string): Promise<UserPayload | null> {
		try {
			const payload = jwt.verify(
				token,
				this.configService.get('ACCESS_TOKEN')
			);
			return payload as UserPayload;
		} catch (e) {
			return null;
		}
	}

	async validateRefreshToken(token: string): Promise<UserPayload | null> {
		try {
			const payload = jwt.verify(
				token,
				this.configService.get('REFRESH_TOKEN')
			);
			return payload as UserPayload;
		} catch (e) {
			return null;
		}
	}

	async findToken(token: string): Promise<Token | null> {
		return await Token.findOne({
			relations: { user: true },
			where: { refreshToken: token },
		});
	}
}
