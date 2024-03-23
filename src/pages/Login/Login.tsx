import { LoginForm } from '../../components/domain/LoginForm/LoginForm';
import { Heading } from '../../components/ui/Heading/Heading';
import { Wrapper } from '../../components/ui/Wrapper/Wrapper';
import styles from './Login.module.css';

export function LoginPage() {
	return (
		<div className={styles.login}>
			<Wrapper>
				<div className={styles['login-inner']}>
					<Heading className={styles.title}>Login</Heading>
					<LoginForm />
				</div>
			</Wrapper>
		</div>
	);
}
