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
import Users from './components/Users';
import BookingsAdmin from './components/BookingsAdmin';
import ItemsAdmin from './components/ItemsAdmin';
import ImagesAdmin from './components/ImagesAdmin';
import { AllowOnlyUnconfirmed } from './components/AllowOnlyUnconfirmed';
import { VerificationPage } from './components/VerificationPage';
import { MembersOnlyWarningPage } from './components/MembersOnlyWarningPage';
import { PageContent } from './components/PageContent';

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
          <Route element={<AllowOnlyUnconfirmed />}>
            <Route path="/verification" element={<VerificationPage />} />
          </Route>
          <Route element={<RequireAuth allowedRoles={[e_Roles.User]} />}>
            <Route path="/" element={<Home />} />
            <Route
              path="unauthorized/members-only"
              element={<MembersOnlyWarningPage />}
            />
          </Route>

          <Route
            element={
              <RequireAuth
                allowedRoles={[e_Roles.Member, e_Roles.Admin]}
                redirectTo="/unauthorized/members-only"
              />
            }
          >
            <Route element={<PageContent />}>
            <Route path="booking" element={<GearShare />} />
            <Route path="admin" element={<Admin />}>
              <Route element={<RequireAuth allowedRoles={[e_Roles.Admin]} />}>
                <Route path="users" element={<Users />} />
                <Route path="items" element={<ItemsAdmin />} />
                <Route path="images" element={<ImagesAdmin />} />
              </Route>
              <Route path="bookings" element={<BookingsAdmin />} />
              </Route>
            </Route>
          </Route>

          {/* catch all */}
          <Route path="*" element={<Missing />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
