import React from 'react';
import { useNavigate } from 'react-router-dom';

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    localStorage.removeItem('user'); // Clear user data
    navigate('/login'); // Redirect user to login page
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#121a26]">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-400 mb-4">403</h1>
        <p className="text-xl text-gray-500 tracking-wider uppercase mb-8">
          Unauthorized Action
        </p>
        <button
          onClick={handleRedirect}
          className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
