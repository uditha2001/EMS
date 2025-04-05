import useApi from '../../api/api';
import { useEffect, useState } from 'react';
import UserRolesDistribution from '../../components/adminDashboardsComponents/UserRolesDistribution';
import useEventApi from '../../api/eventApi';

import {
  UsersIcon,
  BookOpenIcon,
  AcademicCapIcon,
  ChartBarIcon,
  BellAlertIcon,
} from '@heroicons/react/24/outline';
import UserTasksDashboard from './UserTasksDashboard';
import DataCard from './DataCard';
import useDashboardApi from '../../api/dashboardApi';
import useAuth from '../../hooks/useAuth';
import SystemPerformance from './SystemPerformance';
import Schedule from './Schedule';

interface Event {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  visibility: string;
  userId: string | null;
}

const AdminDashboard = () => {
  const [activeUsers, setActiveUsers] = useState<number>(0);
  const {
    getUsersCounts,
    getActiveUsersCount,
    getDegreePrograms,
    getOngoingexaminationCount,
  } = useApi();
  const { getSystemPerformance } = useDashboardApi();
  const [degreeProgramsCount, setDegreeProgramsCount] = useState<
    number | string
  >(0);
  const [userCount, setUserCount] = useState<{ [key: string]: number }>({});
  const [examinationsCount, setExaminationsCount] = useState<number>(0);
  const [systemPerformance, setSystemPerformance] = useState<any>({});
  const { auth } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const { getUpcomingPublicEvents, getUpcomingEventByUserId } = useEventApi();
  const [, setLoading] = useState(true);

  useEffect(() => {
    getUsersCounts().then((users) => {
      if (users) {
        setUserCount(users);
      }
    });
    getActiveUsersCount().then((Users) => {
      if (Users) {
        setActiveUsers(Users);
      }
    });
    getDegreePrograms().then((degreePrograms) => {
      setDegreeProgramsCount(degreePrograms.data.length);
    });
    getOngoingexaminationCount().then((examinations) => {
      if (examinations) {
        setExaminationsCount(examinations);
      }
    });
    getSystemPerformance().then((performance) => {
      setSystemPerformance(performance.data);
    });

    const fetchEvents = async () => {
      try {
        const [publicRes, userRes] = await Promise.all([
          getUpcomingPublicEvents(),
          getUpcomingEventByUserId(Number(auth.id)),
        ]);

        const publicEvents = publicRes?.data ?? [];
        const userEvents = userRes?.data ?? [];

        setEvents([...publicEvents, ...userEvents]);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Main Dashboard Content */}
      <div className="flex-1 p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Welcome to {auth.firstName} Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Here's an overview of your examination system
          </p>
        </div>

        {/* Stats Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DataCard
            color="blue"
            count={userCount['TOTAL'] || 0}
            title="Total Users"
            icon={UsersIcon}
          />
          <DataCard
            color="green"
            count={activeUsers}
            title="Active Users"
            icon={UsersIcon}
          />
          <DataCard
            color="amber"
            count={examinationsCount}
            title="Ongoing Exams"
            icon={BookOpenIcon}
          />
          <DataCard
            color="purple"
            count={degreeProgramsCount}
            title="Degree Programs"
            icon={AcademicCapIcon}
          />
        </div>

        {/* Middle section with charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* User Role Distribution */}
          <div className="col-span-1 bg-white dark:bg-gray-800 rounded shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                User Distribution
              </h2>
              <ChartBarIcon className="h-5 w-5 text-gray-400" />
            </div>
            <UserRolesDistribution />
          </div>

          {/* Recent Activity */}
          <div className="col-span-1 bg-white dark:bg-gray-800 rounded shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                Recent Activity
              </h2>
              <BellAlertIcon className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {[
                {
                  action: 'New user registered',
                  time: '5 minutes ago',
                  icon: 'UsersIcon',
                  color: 'bg-blue-100 text-blue-600',
                },
                {
                  action: 'New examination created',
                  time: '2 hours ago',
                  icon: 'BookOpenIcon',
                  color: 'bg-yellow-100 text-yellow-600',
                },
                {
                  action: 'Paper submitted for review',
                  time: '4 hours ago',
                  icon: 'DocumentIcon',
                  color: 'bg-green-100 text-green-600',
                },
                {
                  action: 'System maintenance completed',
                  time: 'Yesterday',
                  icon: 'CogIcon',
                  color: 'bg-purple-100 text-purple-600',
                },
              ].map((item, index) => (
                <div key={index} className="flex items-start">
                  <div className={`${item.color} p-2 rounded-full mr-3`}>
                    <div className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">
                      {item.action}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {item.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-4 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline w-full text-center">
              View all activity
            </button>
          </div>
          {/* System Performance */}
          <SystemPerformance systemPerformance={systemPerformance} />
        </div>

        {/* Calendar / Schedule Section */}
        <Schedule events={events} />
      </div>

      {/* Task Sidebar */}
      <div className="lg:w-96 bg-gray-50 dark:bg-gray-900 p-6">
        <div className="sticky top-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Your Tasks
            </h2>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
              Tasks
            </span>
          </div>
          <UserTasksDashboard />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
