import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useRef, useState } from 'react';
import useRefreshToken from '../../hooks/useRefreshToken';
import { useLocation, useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import useAuth from '../../hooks/useAuth';

interface IProps {
  children: React.ReactNode;
}

export const QueryProvider = ({ children }: IProps) => {
  const refresh = useRefreshToken();
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const isRefreshing = useRef(false);

  const location = useLocation();

  const refreshAuthTokens = async () => {
    if (isRefreshing.current) {
      return;
    }

    isRefreshing.current = true;

    try {
      await refresh();
      // const response = await axios.post('/api/refresh-token');
      // setAuth(response.data);
    } catch (error) {
      setAuth({});
      navigate('/login', { state: { from: location }, replace: true });
      // setAuth(null);
    } finally {
      isRefreshing.current = false;
    }
  };
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30000, // 30 seconds
            retry: (failureCount, error) => {
              if (error instanceof AxiosError) {
                // Don't retry for certain error responses
                if (
                  error?.response?.status === 400 ||
                  error?.response?.status === 401
                ) {
                  refreshAuthTokens();
                  return failureCount <= 1;
                }
              }

              return false;
            },
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}

      <ReactQueryDevtools />
    </QueryClientProvider>
  );
};
