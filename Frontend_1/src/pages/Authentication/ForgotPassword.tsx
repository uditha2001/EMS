import { Axios } from '../../common/Axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [username, setUserName] = useState('');
  const [error, setError] = useState(false);
  const [failed, setFailed] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false); // State for custom confirmation modal
  const navigate = useNavigate();

  useEffect(() => {
    const preventGoForward = () => {
      window.history.pushState(null, "", window.location.href);
    };

    window.addEventListener("popstate", preventGoForward);

    return () => {
      window.removeEventListener("popstate", preventGoForward);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      Axios.post(`login/verifyuser?username=${username}`)
        .then((res) => {
          if (res.status === 200) {
            localStorage.setItem("time", JSON.stringify(120));
            navigate('/otp-verification', { state: { username } });
          } else if (res.status === 404) {
            setFailed(true);
          }
        })
        .catch(() => {
          setError(true);
          setUserName('');
        });
    } catch (err) {
      setError(true);
      setUserName('');
    }
  };

  const handleBackToLogin = () => {
    setShowConfirmation(true); // Show the confirmation modal
  };

  const confirmNavigation = () => {
    setShowConfirmation(false);
    navigate('/login'); // Navigate to login on confirmation
  };

  const cancelNavigation = () => {
    setShowConfirmation(false); // Hide the confirmation modal
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-center mb-6 dark:text-white">
        Forgot Password
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {(error || failed) && (
          <p className="text-red-500 text-center">
            Failed to send OTP. Please try again.
          </p>
        )}

        <div>
          <label
            htmlFor="username"
            className="mb-3 block text-sm font-medium text-black dark:text-white"
          >
            Username
          </label>
          <div className="relative">
            <span className="absolute left-4 flex items-center top-0">
              {/* Your SVG icon */}
            </span>
            <input
              id="username"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="username"
              required
              className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-primary rounded-md shadow hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          Send OTP
        </button>
      </form>

      <div className="mt-4 text-center">
        <button
          onClick={handleBackToLogin}
          className="px-4 py-2 text-primary border border-primary rounded-md hover:bg-primary hover:text-white dark:border-blue-500 dark:text-blue-500 dark:hover:bg-blue-600 dark:hover:text-white"
        >
          Back to Login
        </button>
      </div>

      {/* Custom Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 dark:bg-gray-800">
            <h2 className="text-lg font-bold text-black dark:text-white mb-4">
              Confirm Navigation
            </h2>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to go back to the login page? Unsaved changes will be lost.
            </p>
            <div className="flex justify-between">
              <button
                onClick={confirmNavigation}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Yes
              </button>
              <button
                onClick={cancelNavigation}
                className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
