import { injectable } from 'inversify';
import { ILogger } from './logger.interface';
import 'reflect-metadata'

@injectable()
export class Logger implements ILogger {
    logger: Console;

    constructor() {
        this.logger = console;
    }
    warn(...args: unknown[]): void {
        this.logger.warn(...args);
    }
    error(...args: unknown[]): void {
        this.logger.error(...args);
    }
    info(...args: unknown[]): void {
        this.logger.info(...args);
    }
}
