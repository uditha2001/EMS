import { Outlet, Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

const GuestLayout = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      {/* Logo placed above the form box */}
      <Link to="/" className="mb-8 flex items-center gap-2 no-underline group">
        <div className="rounded-full p-3 bg-white dark:bg-gray-800 shadow-md group-hover:bg-[#3c50e0]/10 dark:group-hover:bg-[#5670ef]/10 transition-colors">
          <GraduationCap className="w-8 h-8 text-[#3c50e0] dark:text-[#5670ef] group-hover:text-[#2c40d0] dark:group-hover:text-[#4660e0]" />
        </div>
        <span className="text-3xl font-bold text-gray-800 dark:text-white group-hover:text-[#3c50e0] dark:group-hover:text-[#5670ef] transition-colors">
          EMS
        </span>
      </Link>

      {/* Form container */}
      <main className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
        <Outlet />
      </main>
    </div>
  );
};

export default GuestLayout;
