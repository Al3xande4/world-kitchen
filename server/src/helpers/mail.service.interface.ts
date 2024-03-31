export interface IMailService {
	sendActivationMail: (to: string, link: string) => Promise<void>;
	restoreMail: (to: string, link: string) => Promise<void>;
}
