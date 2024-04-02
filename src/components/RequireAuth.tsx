import { useLocation, Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

interface IProps {
  allowedRoles?: number[];
  redirectTo?: string;
}

const RequireAuth = ({ allowedRoles, redirectTo }: IProps) => {
  const { auth } = useAuth();
  const location = useLocation();

  if (auth?.roles?.find((role) => allowedRoles?.includes(role))) {
    return <Outlet />;
  }
  if (auth?.roles?.length === 0) {
    return <Navigate to="/verification" state={{ from: location }} replace />;
  }
  if (auth?.accessToken) {
    return (
      <Navigate
        to={redirectTo ?? '/unauthorized'}
        state={{ from: location }}
        replace
      />
    );
  }

  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default RequireAuth;
