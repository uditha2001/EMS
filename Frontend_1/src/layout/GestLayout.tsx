import { Outlet } from 'react-router-dom';

const GuestLayout = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      {/* Main Content Wrapper */}
      <main className="w-full max-w-md p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <Outlet />
      </main>
    </div>
  );
};

export default GuestLayout;
