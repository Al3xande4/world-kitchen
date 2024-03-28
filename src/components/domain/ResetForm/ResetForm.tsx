import cn from 'classnames';
import styles from './ResetForm.module.css';
import { ResetFormProps } from './ResetForm.props';
import { Label } from '../../ui/Label/Label';
import { Input } from '../../ui/Input/Input';
import { Button } from '../../ui/Button/Button';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';
import { resetPass, userActions } from '../../../store/user/user.slice';
import { useNavigate } from 'react-router-dom';

interface ResetState {
	password: {
		value: string;
	};
	confirm: {
		value: string;
	};
}
interface ErrorStae {
	field: 'password' | 'confirm';
	message: string;
}

export function ResetForm({ className, link }: ResetFormProps) {
	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate();
	const error = useSelector((state: RootState) => state.user.resetError);
	const finished = useSelector(
		(state: RootState) => state.user.resetFinished
	);
	const refNew = useRef<HTMLInputElement>(null);
	const refConfirm = useRef<HTMLInputElement>(null);
	const [validationError, setValidationError] = useState<ErrorStae>();

	useEffect(() => {
		dispatch(userActions.clearState());
	}, []);

	useEffect(() => {
		if (finished) {
			navigate('/auth/login');
		}
	}, [finished]);

	const submit = (e: FormEvent) => {
		e.preventDefault();
		const { password, confirm } = e.target as typeof e.target & ResetState;
		if (!validateForm(password.value, confirm.value)) {
			return;
		}
		sendReset(password.value);
	};

	const validateForm = (newpass: string, confirm: string): boolean => {
		if (!newpass) {
			refNew.current?.focus();
			setValidationError({
				field: 'password',
				message: 'Password should not be empty',
			});
			return false;
		}

		if (!confirm) {
			refConfirm.current?.focus();
			setValidationError({
				field: 'confirm',
				message: 'Password should not be empty',
			});
			return false;
		}

		if (newpass != confirm) {
			refNew.current?.focus();
			setValidationError({
				field: 'password',
				message: 'Passwords are not the same.',
			});
			return false;
		}
		setValidationError(undefined);
		return true;
	};

	const sendReset = async (pass: string) => {
		dispatch(resetPass({ newPass: pass, link }));
	};

	return (
		<form onSubmit={submit} className={cn(className, styles.form)}>
			<div
				className={cn(styles.error, {
					[styles.hidden]: !error,
				})}
			>
				<span className={styles.effect}>
					<img src='/effect.svg'></img>
				</span>
				<p className={styles['error-message']}>{error}</p>
			</div>
			<fieldset className={styles['password-fieldset']}>
				<div className={styles['label-wrapper']}>
					<span className={styles['label-star']}>*</span>
					<Label
						htmlFor='password'
						className={styles['password-label']}
					>
						New Password
					</Label>
				</div>
				<Input
					valid={validationError?.field != 'password'}
					ref={refNew}
					id='password'
					name='password'
					type='password'
					className={styles['password-input']}
				/>
				{validationError?.field == 'password' && (
					<>{validationError.message}</>
				)}
			</fieldset>
			<fieldset className={styles['password-fieldset']}>
				<div className={styles['label-wrapper']}>
					<span className={styles['label-star']}>*</span>
					<Label
						htmlFor='newpass'
						className={styles['password-label']}
					>
						Confirm Password
					</Label>
				</div>
				<Input
					valid={validationError?.field != 'confirm'}
					id='confirm'
					name='confirm'
					type='password'
					className={styles['password-input']}
				/>
				{validationError?.field == 'confirm' && (
					<>{validationError.message}</>
				)}
			</fieldset>
			<Button
				type='submit'
				fillType='filled'
				className={styles['submit-btn']}
			>
				Reset My Password
			</Button>
		</form>
	);
}
