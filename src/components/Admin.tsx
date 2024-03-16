import { Link } from 'react-router-dom';
import Users from './Users';

const Admin = () => {
  return (
    <section className="full-page-center">
      <div className="center-card">
        <h1>Admins Page</h1>
        <br />
        <Users />
        <br />
        <div className="flexGrow">
          <Link to="/">Home</Link>
        </div>
      </div>
    </section>
  );
};

export default Admin;
