import { Navigate, Outlet } from 'react-router';
import { UseAuth } from '../context/AuthContext';

const PrivateRoutes = () => {
	const { authState } = UseAuth();

	if (!authState.user) {
		return <Navigate to="/login" replace />;
	}

	return <Outlet />;
};

export default PrivateRoutes;
