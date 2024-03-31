import cn from 'classnames';
import styles from './ForgotForm.module.css';
import { ForgotFormProps } from './ForgotForm.props';
import { Label } from '../../ui/Label/Label';
import { Input } from '../../ui/Input/Input';
import { Button } from '../../ui/Button/Button';
import { Link, useNavigate } from 'react-router-dom';
import { FormEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store/store';
import { forgotPass } from '../../../store/user/user.slice';
import { Modal } from '../../ui/Modal/Modal';

interface ForgetState {
	email: {
		value: string;
	};
}

export function ForgotForm({ className }: ForgotFormProps) {
	const dispatch = useDispatch<AppDispatch>();
	const [visible, setVisible] = useState<boolean>(false);
	const navigate = useNavigate();

	const submit = (e: FormEvent) => {
		e.preventDefault();
		const { email } = e.target as typeof e.target & ForgetState;
		sendForgot(email.value);
		setVisible(true);
	};

	const sendForgot = async (email: string) => {
		dispatch(forgotPass({ email }));
	};

	return (
		<form onSubmit={submit} className={cn(className, styles.form)}>
			{visible && (
				<Modal>
					<div className={styles.modal}>
						<button
							onClick={() => {
								setVisible(false);
							}}
							className={styles.close}
						>
							<img
								className={styles['close-icon']}
								src='/close.svg'
							></img>
						</button>
						<div className={styles.message}>
							<span className={styles.effect}>
								<img src='/effect.svg'></img>
							</span>
							We've sent you an email with a link to update your
							password.
						</div>
						<Button
							className={styles['forgot-link']}
							fillType='filled'
							onClick={() => {
								navigate(-1);
							}}
						>
							Get Back
						</Button>
					</div>
				</Modal>
			)}
			<fieldset className={styles['email-fieldset']}>
				<Label htmlFor='email' className={styles['email-label']}>
					Email
				</Label>
				<Input
					id='email'
					name='email'
					type='email'
					className={styles['email-input']}
				/>
			</fieldset>
			<Button
				type='submit'
				fillType='filled'
				className={styles['submit-btn']}
			>
				Reset My Password
			</Button>
			<Link className={styles['link-btn']} to={'/auth/login'}>
				<Button
					className={styles.btn}
					type='button'
					fillType='outlined'
				>
					Back to Login
				</Button>
			</Link>
		</form>
	);
}
