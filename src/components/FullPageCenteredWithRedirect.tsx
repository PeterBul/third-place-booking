import './Register.css';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { FullPageCentered } from './FullPageCentered';

interface IProps {
  children: React.ReactNode;
}

export function FullPageCenteredWithRedirect(props: IProps) {
  const { auth } = useAuth();

  if (auth.accessToken) {
    return <Navigate to={'/'} replace />;
  }

  return <FullPageCentered>{props.children}</FullPageCentered>;
}
