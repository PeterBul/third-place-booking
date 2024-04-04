import useAuth from './useAuth';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useQueryClient } from '@tanstack/react-query';

const useLogout = (shouldNavigateToLogin = true) => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return async () => {
    setAuth({});
    setTimeout(() => {
      queryClient.clear();
    }, 1000);
    try {
      await axios.get('/api/auth/logout', {
        withCredentials: true,
      });
    } catch (error) {
      console.error('error', error);
    }
    if (shouldNavigateToLogin) {
      navigate('/login');
    }
  };
};

export default useLogout;
