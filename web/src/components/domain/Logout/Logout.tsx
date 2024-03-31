import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store/store';
import { useEffect } from 'react';
import { logout } from '../../../store/user/user.slice';
import { Navigate } from 'react-router-dom';

export function Logout() {
	const dispatch = useDispatch<AppDispatch>();
	useEffect(() => {
		dispatch(logout());
	}, []);
	return <Navigate to={'/'}></Navigate>;
}
