import { Input } from '../../ui/Input/Input';
import styles from './LoginForm.module.css';
import cn from 'classnames';
import { LoginFormProps } from './LoginForm.props';
import { Label } from '../../ui/Label/Label';
import { Button } from '../../ui/Button/Button';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';
import { FormEvent, useEffect } from 'react';
import { checkAuth, login, userActions } from '../../../store/user/user.slice';

export type LoginFormState = {
	email: {
		value: string;
	};
	password: {
		value: string;
	};
};

export function LoginForm({ className }: LoginFormProps) {
	const dispath = useDispatch<AppDispatch>();
	const navigate = useNavigate();
	const { access_token, isAuth, loginError } = useSelector(
		(state: RootState) => state.user
	);
	useEffect(() => {
		dispath(checkAuth());
		dispath(userActions.clearState());
	}, []);

	useEffect(() => {
		if (isAuth) {
			navigate('/');
		}
	}, [access_token, isAuth]);

	const submit = (e: FormEvent) => {
		e.preventDefault();
		const { email, password } = e.target as typeof e.target &
			LoginFormState;
		sendLogin(email.value, password.value);
	};

	const sendLogin = async (email: string, password: string) => {
		dispath(login({ email, password }));
	};

	return (
		<form className={cn(className, styles['login-form'])} onSubmit={submit}>
			<div
				className={cn(styles.error, {
					[styles.hidden]: !loginError,
				})}
			>
				<span className={styles.effect}>
					<img src='/effect.svg'></img>
				</span>
				<p className={styles['error-message']}>
					{loginError}&nbsp;
					<Link
						className={styles['forgot-link']}
						to={'/auth/login#recover'}
					>
						Forgot your password?
					</Link>
				</p>
			</div>

			<fieldset className={cn(styles.fieldset, styles['email-fieldset'])}>
				<div className={styles['label-wrapper']}>
					<span className={styles['label-star']}>*</span>
					<Label htmlFor='email' className={styles.label}>
						Email
					</Label>
				</div>
				<Input
					id='email'
					name='email'
					placeholder='Email'
					className={styles.email}
				/>
			</fieldset>

			<fieldset
				className={cn(styles.fieldset, styles['password-fieldset'])}
			>
				<div className={styles['label-wrapper']}>
					<span className={styles['label-star']}>*</span>
					<Label htmlFor='password' className={styles.label}>
						Password
					</Label>
				</div>
				<Input
					id='password'
					name='password'
					type='password'
					placeholder='Passowrd'
					className={styles.password}
				/>
			</fieldset>

			<Button
				type='submit'
				fillType='filled'
				className={styles['submit-btn']}
			>
				Sign in
			</Button>

			<Link className={styles['forgot-link']} to={'/auth/login#recover'}>
				Forgot your password?
			</Link>

			<fieldset className={styles['divisor-fieldset']}>
				<legend className={styles['legend']}>OR</legend>
			</fieldset>

			<div className={cn(styles['new-acc-sec'], styles.card)}>
				<p className={styles['card-title']}>Need an account?</p>
				<Link to={'/auth/register'}>
					<Button fillType='outlined'>Create an Account</Button>
				</Link>
			</div>

			<div className={cn(styles['continue-sec'], styles.card)}>
				<p className={styles['card-title']}>
					Go along without an account
				</p>
				<Link to={'/recipes'}>
					<Button fillType='outlined'>Jump straight in</Button>
				</Link>
			</div>
		</form>
	);
}
