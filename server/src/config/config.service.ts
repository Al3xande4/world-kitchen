import { inject, injectable } from 'inversify';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';
import 'reflect-metadata';
import { config, DotenvConfigOutput, DotenvParseOutput } from 'dotenv';
import { IConfigService } from './config.service.interface';

@injectable()
export class ConfigService implements IConfigService {
	private config: DotenvParseOutput;

	constructor(@inject(TYPES.Logger) private logger: ILogger) {
		const result: DotenvConfigOutput = config();
		if (result.error) {
			this.logger.error(`Couldn't read .env file or it doesn't exists`);
		} else {
			this.config = result.parsed as DotenvParseOutput;
			this.logger.info('File .env has been successfuly read');
		}
	}

	get(key: string): string {
		return this.config[key];
	}
}
