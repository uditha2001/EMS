import useApi from '../../api/api';
import { useEffect, useState } from 'react';
import UserRolesDistribution from '../../components/adminDashboardsComponents/UserRolesDistribution';
import DataCard from '../../components/adminDashboardsComponents/DataCard';
import {
  UsersIcon,
  BookOpenIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline';
const AdminDashboard = () => {
  const [activeUsers, setActiveUsers] = useState<number>(0);
  const { getUsersCounts, getActiveUsersCount, getDegreePrograms } = useApi();
  const [degreeProgramsCount, setDegreeProgramsCount] = useState<
    number | string
  >(0);
  const [userCount, setUserCount] = useState<{ [key: string]: number }>({});
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
  }, []);
  return (
    <div className="container mx-auto px-4">
      <h2 className="font-semibold text-black dark:text-white">
        Admin Dashboard
      </h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 mt-6">
        {/* Welcome Message */}

        <div className="h-40 col-span-1 sm:col-span-2 md:col-span-3 xl:col-span-1">
          <DataCard
            color="blue"
            count={userCount['TOTAL']}
            title="Total Users"
            icon={UsersIcon}
          />
        </div>
        <div className="h-40 col-span-1 sm:col-span-2 md:col-span-3 xl:col-span-1">
          <DataCard
            color="green"
            count={activeUsers}
            title="Active Users"
            icon={UsersIcon}
          />
        </div>
        <div className="h-40 col-span-1 sm:col-span-2 md:col-span-3 xl:col-span-1">
          <DataCard
            color="yellow"
            count={0}
            title="On Going Examinations"
            icon={BookOpenIcon}
          />
        </div>
        <div className="h-40 col-span-1 sm:col-span-2 md:col-span-3 xl:col-span-1">
          <DataCard
            color="pink"
            count={degreeProgramsCount}
            title="Total Degree Programs"
            icon={AcademicCapIcon}
          />
        </div>
      </div>
      {/* User Roles Distribution */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 mt-8">
        <div className="col-span-1 sm:col-span-2 md:col-span-3 xl:col-span-1">
          <UserRolesDistribution />
        </div>
      </div>

      {/* Additional sections */}
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-16">
        {/* Example of charts or other components */}
      </div>
    </div>
  );
};

export default AdminDashboard;
