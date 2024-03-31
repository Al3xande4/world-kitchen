import { UserPayload } from '../users/dto/user-payload.dto';
import { Token } from './token.entity';

export type GenerateTokenReturn = {
	accessToken: string;
	refreshToken: string;
};
export interface ITokenService {
	generateToken: (payload: any) => Promise<GenerateTokenReturn>;
	saveToken: (userId: number, refreshToken: string) => Promise<Token>;
	removeToken: (refreshToken: string) => Promise<Token | undefined>;
	validateAccessToken: (token: string) => Promise<UserPayload | null>;
	validateRefreshToken: (token: string) => Promise<UserPayload | null>;
	findToken: (token: string) => Promise<Token | null>;
}
