import useAuth from './useAuth';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

const useLogout = (shouldNavigateToLinkPage = true) => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  return async () => {
    setAuth({});
    try {
      await axios.get('/auth/logout', {
        withCredentials: true,
      });
    } catch (error) {
      console.error('error', error);
    }
    if (shouldNavigateToLinkPage) {
      navigate('/linkpage');
    }
  };
};

export default useLogout;
