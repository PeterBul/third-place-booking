import { Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { useEffect, useState } from 'react';
import useRefreshToken from '../hooks/useRefreshToken';
import { Spinner } from '@chakra-ui/react';
import { FullPageCentered } from './FullPageCentered';

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

  if (!persist) {
    return <Outlet />;
  }
  return (
    <>
      {isLoading ? (
        <FullPageCentered>
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        </FullPageCentered>
      ) : (
        <Outlet />
      )}
    </>
  );
};

export default PersistentLogin;
