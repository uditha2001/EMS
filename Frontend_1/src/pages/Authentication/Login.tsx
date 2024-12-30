import { useState } from "react";
import AuthService from "../../services/Auth-Service";
import useAuth from "../../hooks/useAuth";
import { Navigate } from "react-router-dom";
const Login = () => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [shouldNavigate, setShouldNavigate] = useState(false); // State for navigation
  const {setAuth } = useAuth();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await AuthService.login(username, password);
      setAuth((prev: any) => {
        return {
          ...prev,
          roles: data.user["roles"],
          acessToken: data["accesstoken"],
        };
      });
      setShouldNavigate(true); // Trigger navigation
    } catch (error) {
      console.error("Login failed");
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
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Email
          </label>
          <input
            id="username"
            type="name"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          />
        </div>

        {/* Password Input */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          />
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
