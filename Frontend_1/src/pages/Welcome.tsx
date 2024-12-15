import React from 'react';
import { Link } from 'react-router-dom';

const Welcome: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-center mb-4">Welcome to EMS</h1>
      <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
        Your Exam Management System for seamless administration.
      </p>
      <div className="flex justify-center space-x-4">
        <Link
          to="/login"
          className="py-2 px-4 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
        >
          Login
        </Link>
        <Link
          to="/about"
          className="py-2 px-4 text-indigo-600 border border-indigo-600 hover:bg-indigo-50 rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
        >
          Learn More
        </Link>
      </div>
    </div>
  );
};

export default Welcome;
