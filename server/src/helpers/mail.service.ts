import { inject, injectable } from 'inversify';
import { IMailService } from './mail.service.interface';
import { Transporter, createTransport } from 'nodemailer';
import { TYPES } from '../types';
import { IConfigService } from '../config/config.service.interface';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

@injectable()
export class MailService implements IMailService {
	transporter: Transporter;

	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService
	) {
		this.transporter = createTransport({
			host: configService.get('SMTP_HOST'),
			service: 'gmail',
			secure: false,
			port: +configService.get('SMTP_PORT'),
			auth: {
				user: configService.get('SMTP_USER'),
				pass: configService.get('SMTP_PASSWORD'),
			},
		});
	}
	async sendActivationMail(to: string, link: string) {
		this.transporter.sendMail({
			from: this.configService.get('SMTP_USER'),
			to,
			subject:
				'Account activation on' + this.configService.get('API_URL'),
			text: `${link}`,
			html: `<p>Click <a href="${link}">here</a> to access the link.</p>`,
		});
	}

	async restoreMail(to: string, link: string) {
		this.transporter.sendMail({
			from: this.configService.get('SMTP_USER'),
			to,
			subject: 'Password change on' + this.configService.get('API_URL'),
			text: `${link}`,
			html: `<p>Click <a href="${link}">here</a> to change password.</p>`,
		});
	}
}
