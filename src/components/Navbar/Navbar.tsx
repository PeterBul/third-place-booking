import useAuth from '../../hooks/useAuth';
import useLogout from '../../hooks/useLogout';
import './Navbar.css';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { auth } = useAuth();
  const isLoggedIn = auth.accessToken;
  const handleLogout = useLogout();

  return (
    <nav className="navbar navbar-fixed">
      <ul className="nav-items nav-items-left">
        <li className="nav-item">
          <Link to="/">Home</Link>
        </li>
      </ul>
      <ul className="nav-items nav-items-right">
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
    </nav>
  );
};

export default Navbar;
