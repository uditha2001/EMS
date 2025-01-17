import useAuth from '../../hooks/useAuth';

const AdminDashboard = () => {
  const { auth } = useAuth();
  const { firstName, roles, accessToken } = auth;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {/* Welcome Message */}
      <div className="p-6 bg-white shadow-md rounded dark:bg-gray-800 col-span-1 sm:col-span-2 md:col-span-3 xl:col-span-1">
        <h1 className="text-2xl font-bold text-center mb-6 dark:text-white">
          Welcome, {firstName || 'User'}!
        </h1>

        {/* User Details */}
        <div className="mt-4">
          {/* Roles */}
          <p className="text-gray-800 dark:text-gray-200">
            <strong>Roles:</strong>{' '}
            {roles?.length ? roles.join(', ') : 'No roles assigned'}
          </p>

          {/* Access Token */}
          {accessToken && (
            <p className="mt-4 text-gray-800 dark:text-gray-200">
              <strong>Access Token:</strong>{' '}
              <span className="break-words whitespace-pre-wrap text-sm bg-gray-100 dark:bg-gray-700 rounded p-2 block">
                {accessToken}
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
