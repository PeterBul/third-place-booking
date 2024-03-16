import './App.css';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './components/Login/Login';
import Register from './components/Register';
import Unauthorized from './components/Unauthorized';
import Home from './components/Home/Home';
import Admin from './components/Admin';
import Missing from './components/Missing';
import RequireAuth from './components/RequireAuth';
import PersistentLogin from './components/PersistentLogin';
import { e_Roles } from './enums/e_Roles';
import GearShare from './components/GearShare/GearShare';

function App() {
  return (
    <Routes>
      {/* Persistent login wraps all because we want the app bar to load logout button immediately */}
      <Route element={<PersistentLogin />}>
        <Route path="/" element={<Layout />}>
          {/* public routes */}
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="unauthorized" element={<Unauthorized />} />

          {/* protected routes */}
          <Route element={<RequireAuth allowedRoles={[e_Roles.User]} />}>
            <Route path="/" element={<Home />} />
            <Route path="booking" element={<GearShare />} />
          </Route>

          <Route element={<RequireAuth allowedRoles={[e_Roles.Admin]} />}>
            <Route path="admin" element={<Admin />} />
          </Route>

          {/* catch all */}
          <Route path="*" element={<Missing />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
