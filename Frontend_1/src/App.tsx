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
import ForgotPassword from './pages/Authentication/ForgotPassword';
import ResetPassword from './pages/Authentication/ResetPassword';
import OTPVerification from './pages/Authentication/OTPVerification';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const renderPage = (title: string, Component: JSX.Element) => (
    <>
      <PageTitle title={title} />
      {Component}
    </>
  );

  if (loading) return <Loader />;

  return (
    <Routes>
      <Route index element={renderPage('Welcome | EMS', <Welcome />)} />

      {/* Unauthorized Route */}
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Guest Layout */}
      <Route element={<GuestLayout />}>
        <Route path="/login" element={renderPage('Login | EMS', <Login />)} />
        <Route
          path="/forgot-password"
          element={renderPage('Forgot Password | EMS', <ForgotPassword />)}
        />
        <Route
          path="/otp-verification"
          element={renderPage('Verify OTP | EMS', <OTPVerification />)}
        />
        <Route
          path="/reset-password"
          element={renderPage('Reset Password | EMS', <ResetPassword />)}
        />
      </Route>

      {/* Authenticated Routes */}
      <Route element={<PersistLogin />}>
        <Route element={<RequireAuth />}>
          <Route element={<AuthenticatedLayout isAuthenticated={true} />}>
            <Route
              path="/dashboard"
              element={renderPage('Dashboard | EMS', <AdminDashboard />)}
            />
            <Route
              path="/calendar"
              element={renderPage('Calendar | EMS', <Calendar />)}
            />
            <Route
              path="/profile"
              element={renderPage('Profile | EMS', <Profile />)}
            />
            <Route
              path="/settings"
              element={renderPage('Settings | EMS', <Settings />)}
            />

            {/* User Management Routes */}
            <Route
              element={<RequireAuth allowedPermissions={['View Users']} />}
            >
              <Route
                path="/usermanagement/users"
                element={renderPage('Users | EMS', <Users />)}
              />
            </Route>

            <Route
              element={<RequireAuth allowedPermissions={['Create Users']} />}
            >
              <Route
                path="/usermanagement/users/create"
                element={renderPage('Create User | EMS', <CreateUser />)}
              />
            </Route>

            <Route
              element={<RequireAuth allowedPermissions={['Edit Users']} />}
            >
              <Route
                path="/usermanagement/users/edit/:userId"
                element={renderPage('Edit User | EMS', <EditUser />)}
              />
            </Route>

            {/* Role Management Routes */}
            <Route
              element={<RequireAuth allowedPermissions={['view roles']} />}
            >
              <Route
                path="/usermanagement/roles"
                element={renderPage('Roles | EMS', <Roles />)}
              />
            </Route>

            <Route
              element={<RequireAuth allowedPermissions={['create roles']} />}
            >
              <Route
                path="/usermanagement/roles/create"
                element={renderPage('Create Role | EMS', <CreateRole />)}
              />
            </Route>

            <Route element={<RequireAuth allowedPermissions={['edit role']} />}>
              <Route
                path="/usermanagement/roles/edit/:roleId"
                element={renderPage('Edit Role | EMS', <EditRole />)}
              />
            </Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
