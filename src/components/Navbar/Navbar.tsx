import { Flex } from '@chakra-ui/layout';
import useAuth from '../../hooks/useAuth';
import useLogout from '../../hooks/useLogout';
import './Navbar.css';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { auth } = useAuth();
  const isLoggedIn = auth.accessToken;
  const handleLogout = useLogout();

  return (
    <Flex
      justifyContent={'space-between'}
      alignItems={'center'}
      mb={'1rem'}
      p={'1rem'}
      pos={'fixed'}
      top={'10px'}
      left={'10px'}
      right={'10px'}
      zIndex={100}
      bgColor={'rgba(26, 32, 44, 0.60)'}
      backdropFilter={'blur(5px)'}
      borderRadius={'20px'}
    >
      <ul className="nav-items nav-items-left">
        <li className="nav-item">
          <Link to="/">Third place</Link>
        </li>
      </ul>
      <ul className="nav-items nav-items-right">
        <li className="nav-item">
          <Link to="/booking">Gear share</Link>
        </li>
        <li className="nav-item">
          <Link to="/admin">Admin</Link>
        </li>
        <li className="nav-item">
          {isLoggedIn ? (
            <button className="nav-button" onClick={handleLogout}>
              Sign Out
            </button>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </li>
      </ul>
    </Flex>
  );
};

export default Navbar;
