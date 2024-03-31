import { RegisterForm } from '../../components/domain/RegisterForm/RegisterForm';
import { Heading } from '../../components/ui/Heading/Heading';
import { Wrapper } from '../../components/ui/Wrapper/Wrapper';
import styles from './Register.module.css';

export function RegisterPage() {
	return (
		<div className={styles.register}>
			<Wrapper>
				<div className={styles['register-inner']}>
					<Heading className={styles.title}>
						Create an Account
					</Heading>
					<RegisterForm />
				</div>
			</Wrapper>
		</div>
	);
}
