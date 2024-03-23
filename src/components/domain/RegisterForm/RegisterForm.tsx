import { Input } from '../../ui/Input/Input';
import styles from './RegisterForm.module.css';
import cn from 'classnames';
import { RegisterFormProps } from './RegisterForm.props';
import { Label } from '../../ui/Label/Label';
import { Button } from '../../ui/Button/Button';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';
import { FormEvent, useEffect } from 'react';
import {
	checkAuth,
	register,
	userActions,
} from '../../../store/user/user.slice';

export type RegisterFormState = {
	username: {
		value: string;
	};
	email: {
		value: string;
	};
	password: {
		value: string;
	};
};

export function RegisterForm({ className }: RegisterFormProps) {
	const dispath = useDispatch<AppDispatch>();
	const navigate = useNavigate();
	const { access_token, isAuth, registerError } = useSelector(
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
		const { email, password, username } = e.target as typeof e.target &
			RegisterFormState;
		sendRegister(email.value, password.value, username.value);
	};

	const sendRegister = async (
		email: string,
		password: string,
		username: string
	) => {
		dispath(register({ email, password, username }));
	};

	return (
		<form
			className={cn(className, styles['register-form'])}
			onSubmit={submit}
		>
			<div
				className={cn(styles.error, {
					[styles.hidden]: !registerError,
				})}
			>
				<span className={styles.effect}>
					<img src='/effect.svg'></img>
				</span>
				<p className={styles['error-message']}>
					{registerError}&nbsp;
					<Link
						className={styles['forgot-link']}
						to={'/auth/register'}
					>
						Forgot your password?
					</Link>
				</p>
			</div>

			<fieldset
				className={cn(styles.fieldset, styles['username-fieldset'])}
			>
				<div className={styles['register-wrapper']}>
					<span className={styles['label-star']}>*</span>
					<Label htmlFor='email' className={styles.label}>
						Name
					</Label>
				</div>
				<Input
					id='username'
					name='username'
					placeholder='Username'
					className={styles.name}
				/>
			</fieldset>

			<fieldset className={cn(styles.fieldset, styles['email-fieldset'])}>
				<div className={styles['register-wrapper']}>
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
				Create Your account
			</Button>

			<fieldset className={styles['divisor-fieldset']}>
				<legend className={styles['legend']}>OR</legend>
			</fieldset>

			<div className={cn(styles['new-acc-sec'], styles.card)}>
				<p className={styles['card-title']}>Already have an account?</p>
				<Link to={'/auth/login'}>
					<Button fillType='outlined'>Sign In</Button>
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
