import axios from '../api/axios';
import useAuth from './useAuth';

const useRefreshToken = () => {
  const { setAuth } = useAuth();
  const refresh = async () => {
    const response = await axios.get('/auth/refresh', {
      withCredentials: true,
    });
    setAuth((prev) => {
      console.log('prev', prev);
      console.log('response.data.accessToken', response.data.accessToken);
      return { ...prev, accessToken: response.data.accessToken };
    });
    return response.data.accessToken as string;
  };

  return refresh;
};

export default useRefreshToken;
