import { Outlet } from 'react-router-dom';
import { QueryProvider } from './QueryProvider';

export const Providers = () => {
  return (
    <QueryProvider>
      <Outlet />
    </QueryProvider>
  );
};
