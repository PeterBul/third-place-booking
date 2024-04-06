import { useRef } from 'react';
import axios from '../api/axios';
import useAuth from './useAuth';

const useRefreshToken = () => {
  const { setAuth } = useAuth();
  const isRefreshing = useRef(false);
  const refresh = async () => {
    if (isRefreshing.current) {
      return;
    }
    isRefreshing.current = true;
    const response = await axios.get('/api/auth/refresh', {
      withCredentials: true,
    });
    setAuth((prev) => {
      return {
        ...prev,
        roles: response.data.roles,
        accessToken: response.data.accessToken,
      };
    });
    isRefreshing.current = false;
    return response.data.accessToken as string;
  };

  return refresh;
};

export default useRefreshToken;
