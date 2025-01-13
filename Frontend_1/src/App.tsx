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
import CreateBulkUsers from './pages/Users/CreateBulkUsers';
import DegreePrograms from './pages/DegreePrograms/DegreePrograms';
import CreateDegreeProgram from './pages/DegreePrograms/CreateDegreeProgram';
import EditDegreeProgram from './pages/DegreePrograms/EditDegreeProgram';
import Courses from './pages/Courses/Courses';
import CreateCourse from './pages/Courses/CreateCourse';
import EditCourse from './pages/Courses/EditCourse';
import CreatePaper from './pages/PaperSetting/CreatePaper';
import ModeratePaper from './pages/PaperModeration/ModeratePaper';
import TransferPaper from './pages/PaperTransfer/TransferPaper';
import AssignRoles from './pages/RoleAssignments/AssignRoles';
import AcademicYears from './pages/AcademicYears/AcademicYears';
import PublicKeyPage from './pages/PaperTransfer/PublicKeyPage';
import CryptographyService from './services/CryptographyService';

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
        <Route element={<CryptographyService/>}/>
        <Route path='/encrypt' element={renderPage('Encrypt | EMS', <CryptographyService/>)}/>
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
            <Route element={<RequireAuth allowedPermissions={['READ_USER']} />}>
              <Route
                path="/usermanagement/users"
                element={renderPage('Users | EMS', <Users />)}
              />
            </Route>

            <Route
              element={<RequireAuth allowedPermissions={['CREATE_USER']} />}
            >
              <Route
                path="/usermanagement/users/create"
                element={renderPage('Create User | EMS', <CreateUser />)}
              />
            </Route>

            <Route
              element={<RequireAuth allowedPermissions={['CREATE_USER']} />}
            >
              <Route
                path="/usermanagement/users/createbulk"
                element={renderPage('Create User | EMS', <CreateBulkUsers />)}
              />
            </Route>

            <Route
              element={<RequireAuth allowedPermissions={['UPDATE_USER']} />}
            >
              <Route
                path="/usermanagement/users/edit/:userId"
                element={renderPage('Edit User | EMS', <EditUser />)}
              />
            </Route>

            {/* Role Management Routes */}
            <Route element={<RequireAuth allowedPermissions={['READ_ROLE']} />}>
              <Route
                path="/usermanagement/roles"
                element={renderPage('Roles | EMS', <Roles />)}
              />
            </Route>

            <Route
              element={<RequireAuth allowedPermissions={['CREATE_ROLE']} />}
            >
              <Route
                path="/usermanagement/roles/create"
                element={renderPage('Create Role | EMS', <CreateRole />)}
              />
            </Route>

            <Route
              element={<RequireAuth allowedPermissions={['UPDATE_ROLE']} />}
            >
              <Route
                path="/usermanagement/roles/edit/:roleId"
                element={renderPage('Edit Role | EMS', <EditRole />)}
              />
            </Route>

            {/* Degree Programs Routes */}
            <Route
              element={
                <RequireAuth allowedPermissions={['READ_DEGREE_PROGRAM']} />
              }
            >
              <Route
                path="/academic/degreeprograms"
                element={renderPage(
                  'Degree Programs | EMS',
                  <DegreePrograms />,
                )}
              />
            </Route>

            <Route
              element={
                <RequireAuth allowedPermissions={['CREATE_DEGREE_PROGRAM']} />
              }
            >
              <Route
                path="/academic/degreeprograms/create"
                element={renderPage(
                  'Create Degree Program | EMS',
                  <CreateDegreeProgram />,
                )}
              />
            </Route>

            <Route
              element={
                <RequireAuth allowedPermissions={['UPDATE_DEGREE_PROGRAM']} />
              }
            >
              <Route
                path="/academic/degreeprograms/edit/:degreeprogramId"
                element={renderPage(
                  'Edit Degree Program | EMS',
                  <EditDegreeProgram />,
                )}
              />
            </Route>

            {/* Courses Routes */}
            <Route
              element={<RequireAuth allowedPermissions={['READ_COURSE']} />}
            >
              <Route
                path="/academic/courses"
                element={renderPage('Courses | EMS', <Courses />)}
              />
            </Route>

            <Route
              element={<RequireAuth allowedPermissions={['CREATE_COURSE']} />}
            >
              <Route
                path="/academic/courses/create"
                element={renderPage('Create Course | EMS', <CreateCourse />)}
              />
            </Route>

            <Route
              element={<RequireAuth allowedPermissions={['UPDATE_COURSE']} />}
            >
              <Route
                path="/academic/courses/edit/:courseId"
                element={renderPage('Edit Course | EMS', <EditCourse />)}
              />
            </Route>
            <Route
              element={<RequireAuth allowedPermissions={['ACADEMIC_YEAR']} />}
            >
              <Route
                path="/academic/academicyears"
                element={renderPage('Academic Years | EMS', <AcademicYears />)}
              />
            </Route>

            {/* Paper Workflow Routes */}
            <Route
              element={<RequireAuth allowedPermissions={['CREATE_PAPER']} />}
            >
              <Route
                path="/paper/create"
                element={renderPage('Paper Setting | EMS', <CreatePaper />)}
              />
            </Route>

            <Route
              element={<RequireAuth allowedPermissions={['MODERATE_PAPER']} />}
            >
              <Route
                path="/paper/moderate"
                element={renderPage(
                  'Paper Moderation | EMS',
                  <ModeratePaper />,
                )}
              />
            </Route>

            <Route
              element={<RequireAuth allowedPermissions={['TRANSFER_PAPER']} />}
            >
              <Route
                path="/paper/transfer"
                element={renderPage('Paper Transfer | EMS', <TransferPaper />)}
              />
              <Route
                path="/paper/public-key"
                element={renderPage('Paper Transfer | EMS', <PublicKeyPage />)}
              />
            </Route>

            <Route
              element={
                <RequireAuth allowedPermissions={['ASSIGN_EXAM_ROLE']} />
              }
            >
              <Route
                path="/paper/roles"
                element={renderPage('Role Assignments | EMS', <AssignRoles />)}
              />
            </Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
