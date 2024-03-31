import { useLocation } from 'react-router-dom';
import { LoginForm } from '../../components/domain/LoginForm/LoginForm';
import { Heading } from '../../components/ui/Heading/Heading';
import { Wrapper } from '../../components/ui/Wrapper/Wrapper';
import styles from './Login.module.css';
import { ForgotForm } from '../../components/domain/ForgotForm/ForgotForm';

export function LoginPage() {
	const location = useLocation();

	return (
		<div className={styles.login}>
			<Wrapper>
				<div className={styles['login-inner']}>
					{location.hash != '#recover' && (
						<>
							<Heading className={styles.title}>Login</Heading>
							<LoginForm />
						</>
					)}

					{location.hash == '#recover' && (
						<>
							<Heading className={styles.title}>
								Reset account password
							</Heading>
							<ForgotForm />
						</>
					)}
				</div>
			</Wrapper>
		</div>
	);
}
