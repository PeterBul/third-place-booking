import './Register.css';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { FullPageCentered } from './FullPageCentered';
import { RegisterForm } from './RegisterForm';

function Register() {
  const { auth } = useAuth();

  if (auth.accessToken) {
    return <Navigate to={'/'} replace />;
  }

  return (
    <FullPageCentered>
      <RegisterForm />
    </FullPageCentered>
  );
}

export default Register;
