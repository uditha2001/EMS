import { useState } from 'react';
import AuthService from '../../services/Auth-Service';
import useAuth from '../../hooks/useAuth';
import { Navigate, Link } from 'react-router-dom';
const Login = () => {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [shouldNavigate, setShouldNavigate] = useState(false); // State for navigation
  const [deActiveStatus, setDeActiveStatus] = useState(false);
  const [error, setError] = useState(false);
  const { setAuth } = useAuth();
  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      const data = await AuthService.login(username, password);
      if (data != null) {
        setAuth((prev: any) => {
          return {
            ...prev,
            id: data.user['id'],
            firstName: data.user['firstName'],
            roles: data.user['roles'],
            acessToken: data['accesstoken'],
          };
        });
        console.log('data is not nll');
        setShouldNavigate(true); // Trigger navigation
      } else {
        setDeActiveStatus(true);
        console.log('data is null');
      }
    } catch (error) {
      console.error('Login failed');
      setError(true);
    }
  };

  // Redirect to dashboard if login is successful
  if (shouldNavigate) {
    return <Navigate to="/dashboard" replace />;
  }
  return (
    <div>
      <h1 className="text-2xl font-bold text-center mb-6 dark:text-white">
        Welcome to EMS
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Input */}
        {error ? (
          <h3 className="text-red-500 text-center">invailid credentials</h3>
        ) : null}
        {deActiveStatus ? (
          <h3 className="text-red-500 text-center">user is deactivated!</h3>
        ) : null}
        <div className="relative">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            User
          </label>
          <div className="mt-1">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 dark:text-gray-400 top-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 250 200"
                xmlSpace="preserve"
                className="w-8 h-8"
                fill="currentColor"
              >
                <path
                  fill="#282828"
                  d="M135.832 140.848h-70.9c-2.9 0-5.6-1.6-7.4-4.5-1.4-2.3-1.4-5.7 0-8.6l4-8.2c2.8-5.6 9.7-9.1 14.9-9.5 1.7-.1 5.1-.8 8.5-1.6 2.5-.6 3.9-1 4.7-1.3-.2-.7-.6-1.5-1.1-2.2-6-4.7-9.6-12.6-9.6-21.1 0-14 9.6-25.3 21.5-25.3s21.5 11.4 21.5 25.3c0 8.5-3.6 16.4-9.6 21.1-.5.7-.9 1.4-1.1 2.1.8.3 2.2.7 4.6 1.3 3 .7 6.6 1.3 8.4 1.5 5.3.5 12.1 3.8 14.9 9.4l3.9 7.9c1.5 3 1.5 6.8 0 9.1-1.6 2.9-4.4 4.6-7.2 4.6zm-35.4-78.2c-9.7 0-17.5 9.6-17.5 21.3 0 7.4 3.1 14.1 8.2 18.1.1.1.3.2.4.4 1.4 1.8 2.2 3.8 2.2 5.9 0 .6-.2 1.2-.7 1.6-.4.3-1.4 1.2-7.2 2.6-2.7.6-6.8 1.4-9.1 1.6-4.1.4-9.6 3.2-11.6 7.3l-3.9 8.2c-.8 1.7-.9 3.7-.2 4.8.8 1.3 2.3 2.6 4 2.6h70.9c1.7 0 3.2-1.3 4-2.6.6-1 .7-3.4-.2-5.2l-3.9-7.9c-2-4-7.5-6.8-11.6-7.2-2-.2-5.8-.8-9-1.6-5.8-1.4-6.8-2.3-7.2-2.5-.4-.4-.7-1-.7-1.6 0-2.1.8-4.1 2.2-5.9.1-.1.2-.3.4-.4 5.1-3.9 8.2-10.7 8.2-18-.2-11.9-8-21.5-17.7-21.5z"
                />
              </svg>
            </span>
            <input
              id="username"
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              required
              className="block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="relative">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Password
          </label>
          <div className="mt-1">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 dark:text-gray-400 top-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="20"
                height="20"
                viewBox="0 0 50 50"
                className="w-5 h-5"
                fill="currentColor"
              >
                <path d="M 25 3 C 18.363281 3 13 8.363281 13 15 L 13 20 L 9 20 C 7.355469 20 6 21.355469 6 23 L 6 47 C 6 48.644531 7.355469 50 9 50 L 41 50 C 42.644531 50 44 48.644531 44 47 L 44 23 C 44 21.355469 42.644531 20 41 20 L 37 20 L 37 15 C 37 8.363281 31.636719 3 25 3 Z M 25 5 C 30.566406 5 35 9.433594 35 15 L 35 20 L 15 20 L 15 15 C 15 9.433594 19.433594 5 25 5 Z M 9 22 L 41 22 C 41.554688 22 42 22.445313 42 23 L 42 47 C 42 47.554688 41.554688 48 41 48 L 9 48 C 8.445313 48 8 47.554688 8 47 L 8 23 C 8 22.445313 8.445313 22 9 22 Z M 25 30 C 23.300781 30 22 31.300781 22 33 C 22 33.898438 22.398438 34.6875 23 35.1875 L 23 38 C 23 39.101563 23.898438 40 25 40 C 26.101563 40 27 39.101563 27 38 L 27 35.1875 C 27.601563 34.6875 28 33.898438 28 33 C 28 31.300781 26.699219 30 25 30 Z"></path>
              </svg>
            </span>
            <input
              id="password"
              type="password"
              placeholder="Type password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            />
          </div>
        </div>

        <div className="text-center mt-4">
          <Link to="/resetPassword" className="text-blue-500 hover:underline">
            Forgot Password?
          </Link>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Sign In
          </button>
        </div>
      </form>

      {/* Extra Links */}
      <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Department of Computer Science
      </div>
    </div>
  );
};

export default Login;
