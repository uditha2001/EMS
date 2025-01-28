import useApi from '../../api/api';
import { useEffect, useState } from 'react';
import UserRolesDistribution from '../../components/adminDashboardsComponents/UserRolesDistribution';
import DataCard from '../../components/adminDashboardsComponents/DataCard';
import { UsersIcon} from '@heroicons/react/24/outline';
const AdminDashboard = () => {
  const [activeUsers, setActiveUsers] = useState<number>(0);
  const {getUsersCounts,getActiveUsersCount}=useApi();
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

}, []);
  return (
    <div>
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
          color="purple"
          count={activeUsers}
          title="Active Users"
          icon={UsersIcon}
        />
      </div>
      <div className='h-40 col-span-1 sm:col-span-2 md:col-span-3 xl:col-span-1'>
        <DataCard
          color="red"
          count={activeUsers}
          title="Active Users"
          icon={UsersIcon}
        />
      </div>
    </div>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 mt-4">
      <div className='col-span-1 sm:col-span-2 md:col-span-3 xl:col-span-1' >
      <UserRolesDistribution />
      </div>
    </div>
    </div>
  );
};

export default AdminDashboard;
