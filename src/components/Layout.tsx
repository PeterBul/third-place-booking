import { Outlet } from 'react-router-dom';
import Navbar from './Navbar/Navbar';
import { LoggedOutNavbar } from './Navbar/LoggedOutNavbar';

interface IProps {
  isProtected?: boolean;
}
const Layout = (props: IProps) => {
  return (
    <main className="App">
      {props.isProtected ? <Navbar /> : <LoggedOutNavbar />}
      <Outlet />
    </main>
  );
};

export default Layout;
