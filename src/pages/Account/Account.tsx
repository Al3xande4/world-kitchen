import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { logout } from '../../store/user/user.slice';
import { Heading } from '../../components/ui/Heading/Heading';
import { Button } from '../../components/ui/Button/Button';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export function AccountPage() {
	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate();
	const { isAuth } = useSelector((state: RootState) => state.user);

	useEffect(() => {
		if (!isAuth) {
			navigate('/');
		}
	}, [isAuth]);

	const onLogoutClick = () => {
		dispatch(logout());
	};
	return (
		<div>
			<Heading>Logout</Heading>
			<Button fillType='filled' onClick={onLogoutClick}>
				logout
			</Button>
		</div>
	);
}
