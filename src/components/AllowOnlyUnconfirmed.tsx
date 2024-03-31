import { useLocation, Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { e_Roles } from '../enums';

export const AllowOnlyUnconfirmed = () => {
  const { auth } = useAuth();
  const location = useLocation();

  if (auth?.roles?.find((role) => role === e_Roles.User)) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  if (auth?.accessToken) {
    return <Outlet />;
  }

  return <Navigate to="/login" state={{ from: location }} replace />;
};
