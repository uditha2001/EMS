import useApi from '../../api/api';
import { useEffect, useState } from 'react';
import UserRolesDistribution from '../../components/adminDashboardsComponents/UserRolesDistribution';
import DataCard from '../../components/adminDashboardsComponents/DataCard';
import { UsersIcon,BookOpenIcon,AcademicCapIcon} from '@heroicons/react/24/outline';
const AdminDashboard = () => {
  const [activeUsers, setActiveUsers] = useState<number>(0);
  const {getUsersCounts,getActiveUsersCount,getDegreePrograms}=useApi();
  const [degreeProgramsCount, setDegreeProgramsCount] = useState<number | string>(0);
  const [userCount, setUserCount] = useState<{ [key: string]: number }>({});
  useEffect(() => {
    getUsersCounts().then(users => {
      if(users){
        setUserCount(users);
      }
    });
    getActiveUsersCount().then(Users => {
      if(Users){
        setActiveUsers(Users);
      }
      console.log(activeUsers+"checking");
    }
    );
    getDegreePrograms().then(degreePrograms => {
      setDegreeProgramsCount(degreePrograms.data.length);
    });

}, []);
  return (
    <div>
    <h1 className="text-3xl font-semibold text-gray-800 dark:text-white">Admin Dashboard</h1>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {/* Welcome Message */}
    
      <div className='h-40 col-span-1 sm:col-span-2 md:col-span-3 xl:col-span-1'>
        <DataCard
          color="blue"
          count={userCount['TOTAL']}
          title="Total Users"
          icon={UsersIcon}
        />
      </div>
      <div className='h-40 col-span-1 sm:col-span-2 md:col-span-3 xl:col-span-1'>
        <DataCard
          color="green"
          count={activeUsers}
          title="Active Users"
          icon={UsersIcon}
        />
      </div>
      <div className='h-40 col-span-1 sm:col-span-2 md:col-span-3 xl:col-span-1'>
        <DataCard
          color="yellow"
          count={0}
          title="On Going Examinations"
          icon={BookOpenIcon}
        />
      </div>
      <div className='h-40 col-span-1 sm:col-span-2 md:col-span-3 xl:col-span-1'>
        <DataCard
          color="pink"
          count={degreeProgramsCount}
          title="Total Degree Programs"
          icon={AcademicCapIcon}
        />
      </div>
    </div>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 mt-16">
      <div className='col-span-1 sm:col-span-2 md:col-span-3 xl:col-span-1' >
      <UserRolesDistribution />
      </div>
      <div className='col-span-2 sm:col-span-2 md:col-span-3 xl:col-span-2 bg-white' >
      <p>chart that shows timeline of examinations activities</p>
      </div>
    </div>
    </div>
  );
};

export default AdminDashboard;
