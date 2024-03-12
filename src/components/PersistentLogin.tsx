import { Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { useEffect, useState } from 'react';
import useRefreshToken from '../hooks/useRefreshToken';

const PersistentLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const { auth, persist } = useAuth();
  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    if (!auth?.accessToken) {
      verifyRefreshToken();
    } else {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log(`isLoading: ${isLoading}`);
    console.log(`aT: ${JSON.stringify(auth.accessToken)}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);
  // const isLoggedIn = auth.email;

  if (!persist) {
    return <Outlet />;
  }
  return <>{isLoading ? <div>Loading...</div> : <Outlet />}</>;
};

export default PersistentLogin;
