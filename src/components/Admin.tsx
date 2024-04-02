import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { useLayoutEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { e_Roles } from '../enums';
import { capitalize } from '../utils/capitalize';

const Admin = () => {
  const location = useLocation();
  const path = location.pathname.split('/')[2];
  const navigate = useNavigate();
  const { auth } = useAuth();

  useLayoutEffect(() => {
    if (!path) {
      navigate('bookings', { replace: true });
    }
  }, [navigate, path]);

  const paths = auth.roles?.includes(e_Roles.Admin)
    ? ['users', 'bookings', 'items', 'images']
    : [];

  return (
    <>
      {paths.length > 0 ? (
        <Tabs
          index={paths.indexOf(path)}
          display={'flex'}
          flexDir={'column'}
          h={'100%'}
        >
          <TabList>
            {paths.map((p) => (
              <Tab as={Link} key={p} to={p}>
                {capitalize(p)}
              </Tab>
            ))}
          </TabList>

          <TabPanels flex={1}>
            {paths.map((p) => (
              <TabPanel key={p} h={'100%'}>
                <Outlet />
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      ) : (
        <Outlet />
      )}
    </>
  );
};

export default Admin;
