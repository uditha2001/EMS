import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import Calendar from './pages/Calendar';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import Welcome from './pages/Welcome';
import CreateUser from './pages/Users/CreateUser';
import Users from './pages/Users/Users';
import EditUser from './pages/Users/EditUser';
import CreateRole from './pages/Roles/CreateRole';
import Roles from './pages/Roles/Roles';
import EditRole from './pages/Roles/EditRole';
import PersistLogin from './components/PresistLogin';
import GuestLayout from './layout/GestLayout';
import Login from './pages/Authentication/Login';
import RequireAuth from './components/RequireAuth';
import AuthenticatedLayout from './layout/AuthenticatedLayout';
import Unauthorized from './components/Unauthorized';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <Routes>
      <Route
        index
        element={
          <>
            <PageTitle title="Welcome | EMS" />
            <Welcome />
          </>
        }
      />
      {/* Unauthorized Route */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      {/* Guest Layout */}
      <Route element={<GuestLayout />}>
        <Route
          path="/login"
          element={
            <>
              <PageTitle title="Login | EMS" />
              <Login />
            </>
          }
        />
      </Route>

      {/* Authenticated Routes */}
      <Route element={<PersistLogin />}>
        <Route element={<RequireAuth allowedRoles={['ADMIN']} />}>
          <Route element={<AuthenticatedLayout isAuthenticated={true} />}>
            <Route
              path="/dashboard"
              element={
                <>
                  <PageTitle title="Dashboard | EMS" />
                  <AdminDashboard />
                </>
              }
            />
            <Route
              path="/calendar"
              element={
                <>
                  <PageTitle title="Calendar | EMS" />
                  <Calendar />
                </>
              }
            />
            <Route
              path="/profile"
              element={
                <>
                  <PageTitle title="Profile | EMS" />
                  <Profile />
                </>
              }
            />
            <Route
              path="/settings"
              element={
                <>
                  <PageTitle title="Settings | EMS" />
                  <Settings />
                </>
              }
            />
            <Route
              path="/usermanagement/users"
              element={
                <>
                  <PageTitle title="Users | EMS" />
                  <Users />
                </>
              }
            />
            <Route
              path="/usermanagement/users/create"
              element={
                <>
                  <PageTitle title="Users | EMS" />
                  <CreateUser />
                </>
              }
            />
            <Route
              path="/usermanagement/users/edit/:userId"
              element={
                <>
                  <PageTitle title="Users | EMS" />
                  <EditUser />
                </>
              }
            />
            <Route
              path="/usermanagement/roles"
              element={
                <>
                  <PageTitle title="Roles | EMS" />
                  <Roles />
                </>
              }
            />
            <Route
              path="/usermanagement/roles/create"
              element={
                <>
                  <PageTitle title="Roles | EMS" />
                  <CreateRole />
                </>
              }
            />
            <Route
              path="/usermanagement/roles/edit/:roleId"
              element={
                <>
                  <PageTitle title="Roles | EMS" />
                  <EditRole />
                </>
              }
            />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
