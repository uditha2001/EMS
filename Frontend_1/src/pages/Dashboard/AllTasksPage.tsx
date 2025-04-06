import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import UserTasksDashboard from './UserTasksDashboard';

const AllTasksPage = () => {
  return (
    <div className="container mx-auto px-4 py-4">
      <Breadcrumb pageName="All Your Tasks" />

      <div>
        <UserTasksDashboard showAll={true} />
      </div>
    </div>
  );
};

export default AllTasksPage;
