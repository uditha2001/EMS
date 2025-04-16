import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

// Fallback Loader
import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SecondMarking from './pages/Results/SecondMarking';
import UploadArchivedPaper from './pages/HistoricalData/UploadArchivedPaper';
import ResultGrading from './pages/Results/ResultGrading';
import RoleAssignmentRevision from './pages/RoleAssignments/RoleAssignmentRevision';
import PreviewRoleAssignmentRevisions from './pages/RoleAssignments/PreviewRoleAssignmentRevisions';
import GradeConditions from './pages/Results/GradeConditions';
import LearnMore from './components/LearnMore';
import AllocateExamResources from './pages/CreateTimetable/AllocateExamResources';
import PreviewTimetable from './pages/CreateTimetable/PreviewTimetable';
import TimeTableRevision from './pages/CreateTimetable/TimeTableRevision';
import PreviewTimetableRevisions from './pages/CreateTimetable/PreviewTimetableRevisions';

// Lazy-loaded components
const Calendar = React.lazy(() => import('./pages/Calendar'));
const Profile = React.lazy(() => import('./pages/Profile'));
const Settings = React.lazy(() => import('./pages/Settings'));
const AdminDashboard = React.lazy(
  () => import('./pages/Dashboard/AdminDashboard'),
);
const Welcome = React.lazy(() => import('./pages/Welcome'));
const CreateUser = React.lazy(() => import('./pages/Users/CreateUser'));
const Users = React.lazy(() => import('./pages/Users/Users'));
const EditUser = React.lazy(() => import('./pages/Users/EditUser'));
const CreateRole = React.lazy(() => import('./pages/Roles/CreateRole'));
const Roles = React.lazy(() => import('./pages/Roles/Roles'));
const EditRole = React.lazy(() => import('./pages/Roles/EditRole'));
const PersistLogin = React.lazy(() => import('./components/PresistLogin'));
const GuestLayout = React.lazy(() => import('./layout/GestLayout'));
const Login = React.lazy(() => import('./pages/Authentication/Login'));
const RequireAuth = React.lazy(() => import('./components/RequireAuth'));
const AuthenticatedLayout = React.lazy(
  () => import('./layout/AuthenticatedLayout'),
);
const Unauthorized = React.lazy(() => import('./components/Unauthorized'));
const ForgotPassword = React.lazy(
  () => import('./pages/Authentication/ForgotPassword'),
);
const ResetPassword = React.lazy(
  () => import('./pages/Authentication/ResetPassword'),
);
const OTPVerification = React.lazy(
  () => import('./pages/Authentication/OTPVerification'),
);
const CreateBulkUsers = React.lazy(
  () => import('./pages/Users/CreateBulkUsers'),
);
const DegreePrograms = React.lazy(
  () => import('./pages/DegreePrograms/DegreePrograms'),
);
const Courses = React.lazy(() => import('./pages/Courses/Courses'));
const CreateCourse = React.lazy(() => import('./pages/Courses/CreateCourse'));
const EditCourse = React.lazy(() => import('./pages/Courses/EditCourse'));
const CreatePaper = React.lazy(
  () => import('./pages/PaperSetting/CreatePaper'),
);
const ModeratePaper = React.lazy(
  () => import('./pages/PaperModeration/ModeratePaper'),
);
const TransferPaper = React.lazy(
  () => import('./pages/PaperTransfer/TransferPaper'),
);
const AssignRoles = React.lazy(
  () => import('./pages/RoleAssignments/AssignRoles'),
);
const Examinations = React.lazy(
  () => import('./pages/Examinations/Examinations'),
);
const TransactionHistory = React.lazy(
  () => import('./pages/PaperTransfer/TransactionHistory'),
);
const CreatePaperStructure = React.lazy(
  () => import('./pages/PaperSetting/CreatePaperStructure'),
);
const Feedback = React.lazy(() => import('./pages/PaperModeration/Feedback'));
const CreateTransaction = React.lazy(
  () => import('./pages/PaperTransfer/CreateTransaction'),
);
const FileUpdate = React.lazy(() => import('./pages/PaperTransfer/FileUpdate'));
const EditPaperStructure = React.lazy(
  () => import('./pages/PaperSetting/EditPaperStructure'),
);
const ModerationDashboard = React.lazy(
  () => import('./pages/PaperModeration/ModerationDashboard'),
);
const Templates = React.lazy(() => import('./pages/PaperSetting/Templates'));
const CreateTimetable = React.lazy(
  () => import('./pages/CreateTimetable/Timetable'),
);
const ResultsUpload = React.lazy(() => import('./pages/Results/ResultsUpload'));
const PreviewAssignedRoles = React.lazy(
  () => import('./pages/RoleAssignments/PreviewAssignedRoles'),
);

const HistoricalData = React.lazy(
  () => import('./pages/HistoricalData/HistoricalData'),
);
const ArchivedPapers = React.lazy(
  () => import('./pages/HistoricalData/ArchivedPapers'),
);
const ExamCenters = React.lazy(() => import('./pages/ExamCenters/ExamCenters'));
const SynchronizeTimetables = React.lazy(
  () => import('./pages/CreateTimetable/SynchronizeTimetables'),
);

const ResultDashboard = React.lazy(
  () => import('./pages/Results/ResultDashboard')
);

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
      <Route
        path="/learn-more"
        element={renderPage('Welcome | EMS', <LearnMore />)}
      />

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
                path="/degreeprograms"
                element={renderPage(
                  'Degree Programs | EMS',
                  <DegreePrograms />,
                )}
              />
            </Route>

            {/* Courses Routes */}
            <Route
              element={<RequireAuth allowedPermissions={['READ_COURSE']} />}
            >
              <Route
                path="/courses"
                element={renderPage('Courses | EMS', <Courses />)}
              />
            </Route>

            <Route
              element={<RequireAuth allowedPermissions={['CREATE_COURSE']} />}
            >
              <Route
                path="/courses/create"
                element={renderPage('Create Course | EMS', <CreateCourse />)}
              />
            </Route>

            <Route
              element={<RequireAuth allowedPermissions={['UPDATE_COURSE']} />}
            >
              <Route
                path="/courses/edit/:courseId"
                element={renderPage('Edit Course | EMS', <EditCourse />)}
              />
            </Route>
            <Route
              element={<RequireAuth allowedPermissions={['EXAMINATION']} />}
            >
              <Route
                path="/examination"
                element={renderPage('Examinations | EMS', <Examinations />)}
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
              <Route
                path="/paper/create/structure"
                element={renderPage(
                  'Paper Setting | EMS',
                  <CreatePaperStructure />,
                )}
              />
              <Route
                path="/paper/edit/structure"
                element={renderPage(
                  'Paper Setting | EMS',
                  <EditPaperStructure />,
                )}
              />
              <Route
                path="/paper/template"
                element={renderPage('Paper Templates | EMS', <Templates />)}
              />
              <Route
                path="/paper/archived"
                element={renderPage(
                  'Archived Papers | EMS',
                  <ArchivedPapers />,
                )}
              />
            </Route>
            <Route
              element={<RequireAuth allowedPermissions={['HISTORICAL_DATA']} />}
            >
              <Route
                path="/history"
                element={renderPage('History | EMS', <HistoricalData />)}
              />
              <Route
                path="/history/archived"
                element={renderPage(
                  'Archived Papers | EMS',
                  <ArchivedPapers />,
                )}
              />
              <Route
                path="/history/archived/upload"
                element={renderPage(
                  'Archived Papers Upload | EMS',
                  <UploadArchivedPaper />,
                )}
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

              <Route
                path="/paper/feedback"
                element={renderPage('Feedback | EMS', <Feedback />)}
              />
            </Route>

            <Route
              path="/paper/moderate/dashboard"
              element={renderPage(
                'Paper Moderation | EMS',
                <ModerationDashboard />,
              )}
            />

            <Route
              element={<RequireAuth allowedPermissions={['TRANSFER_PAPER']} />}
            >
              <Route
                path="/paper/transfer"
                element={renderPage('Paper Transfer | EMS', <TransferPaper />)}
              />
              <Route
                path="/paper/transfer/new"
                element={renderPage(
                  'Paper Transfer | EMS',
                  <CreateTransaction />,
                )}
              />
              <Route
                path="/paper/transfer/edit"
                element={renderPage('Paper Transfer | EMS', <FileUpdate />)}
              />
              <Route
                path="/paper/transfer/history"
                element={renderPage(
                  'Transaction History | EMS',
                  <TransactionHistory />,
                )}
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
              <Route
                path="/paper/roles-assigned-revision"
                element={renderPage(
                  'Role Assignments | EMS',
                  <RoleAssignmentRevision />,
                )}
              />
              <Route
                path="/paper/preview-assigned-roles/:examinationId"
                element={renderPage(
                  'Role Assignments | EMS',
                  <PreviewAssignedRoles />,
                )}
              />
              <Route
                path="/paper/preview-assigned-revision/:examinationId"
                element={renderPage(
                  'Role Assignments | EMS',
                  <PreviewRoleAssignmentRevisions />,
                )}
              />
            </Route>

            {/*Create Timetable */}
            <Route element={<RequireAuth allowedPermissions={['TIMETABLE']} />}>
              <Route
                path="/scheduling/timetable"
                element={renderPage(
                  'Create Timetable | EMS',
                  <CreateTimetable />,
                )}
              />
              <Route
                path="/scheduling/revise-timetable"
                element={renderPage(
                  'Revise Timetable | EMS',
                  <TimeTableRevision />,
                )}
              />

              <Route
                path="/scheduling/revisions/:examinationId"
                element={renderPage(
                  'Timetable Revisions | EMS',
                  <PreviewTimetableRevisions />,
                )}
              />

              <Route
                path="/scheduling/preview-timetable/:examinationId"
                element={renderPage(
                  'Preview Timetable | EMS',
                  <PreviewTimetable examinationId={null} />,
                )}
              />

              <Route
                path="/scheduling/allocateExamResources"
                element={renderPage(
                  'Allocate Exam Resources | EMS',
                  <AllocateExamResources />,
                )}
              />

              <Route
                path="/scheduling/synchronizeTimetables"
                element={renderPage(
                  'Synchronize Timetables | EMS',
                  <SynchronizeTimetables />,
                )}
              />
            </Route>
            <Route
              element={<RequireAuth allowedPermissions={['EXAM_CENTERS']} />}
            >
              <Route
                path="/scheduling/examcenters"
                element={renderPage('Create Timetable | EMS', <ExamCenters />)}
              />
            </Route>

            {/* Result Workflow Routes */}
            <Route
              element={<RequireAuth allowedPermissions={['ENTER_RESULTS']} />}
            >
              <Route
                path="/result/firstmarking"
                element={renderPage('First Marking | EMS', <ResultsUpload />)}
              />
            </Route>
            <Route
              element={<RequireAuth allowedPermissions={['ENTER_RESULTS']} />}
            >
              <Route
                path="/result/secondmarking"
                element={renderPage('Second Marking | EMS', <SecondMarking />)}
              />
            </Route>
            <Route
              element={
                <RequireAuth allowedPermissions={['MODERATE_RESULTS']} />
              }
            >
              <Route
                path="/result/conditions"
                element={renderPage(
                  'Results Grading | EMS',
                  <GradeConditions />,
                )}
              />

              <Route
                path="/result/grading"
                element={renderPage('Results Grading | EMS', <ResultGrading />)}
              />

              <Route
                path="/result/dashboard"
                element={renderPage('Results Dashboard | EMS', <ResultDashboard />)}
              />
            </Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
