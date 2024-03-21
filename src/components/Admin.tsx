import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
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
    <Container maxW={1000} mx="auto" px={6} pt={24} fontSize="sm">
      {paths.length > 0 ? (
        <Tabs index={paths.indexOf(path)}>
          <TabList>
            {paths.map((p) => (
              <Tab key={p}>
                <Link to={p}>{capitalize(p)}</Link>
              </Tab>
            ))}
          </TabList>

          <TabPanels>
            {paths.map((p) => (
              <TabPanel key={p}>
                <Outlet />
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      ) : (
        <Outlet />
      )}
    </Container>
  );
};

export default Admin;
