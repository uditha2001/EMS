import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Axios } from '../../common/Axios';
import Loader from '../../common/Loader';
const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(false);
  const [loadingStatus,setLoadingStatus]=useState(false);
  const [isPasswordMatch, setIsPasswordMatch] = useState(true);
  const [passwordupdatestatus, setPasswordUpdateStatus] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // For confirmation modal
  const [isBackButtonDisabled, setIsBackButtonDisabled] = useState(false); // Disable back button after confirmation
  const navigate = useNavigate();
  const location = useLocation();
  const username = location.state?.username;

  useEffect(() => {
    const handlePopState = () => {
      navigate('/login');
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate]);

  useEffect(() => {
    setIsPasswordMatch(password === confirmPassword);
  }, [password, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordMatch) {
      setError(true);
      return;
    }
    try {
      setLoadingStatus(true)
      const res = await Axios.post(
        `login/updatePassword?password=${password}&username=${username}`
      );
      if (res.data.code === 200) {
        setLoadingStatus(false)
        setPasswordUpdateStatus(false);
        navigate('/login');
      } else {
        setLoadingStatus(false)
        setPasswordUpdateStatus(true);
      }
    } catch (err) {
      setLoadingStatus(false);
      setError(true);
      setPasswordUpdateStatus(true);
      setPassword('');
      setConfirmPassword('');
      console.error("Failed to reset password", err);
    }
  };

  const handleBackButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirmBack = () => {
    setIsBackButtonDisabled(true); // Disable the back button
    setIsModalOpen(false);
    navigate('/login'); // Navigate to login
  };

  const handleCancelBack = () => {
    setIsModalOpen(false); // Close the modal without navigating
  };

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 dark:text-white text-center mb-6">
        Reset Password
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isPasswordMatch && (
          <p className="text-red-500 text-center">Passwords do not match</p>
        )}
        {error && passwordupdatestatus && (
          <p className="text-red-500 text-center">Failed to reset password</p>
        )}
        <div>
          <label
            htmlFor="password"
            className="mb-3 block text-sm font-medium text-black dark:text-white"
          >
            New Password
          </label>
          <div className="relative flex items-center">
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Type new password"
              required
              className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="confirm-password"
            className="mb-3 block text-sm font-medium text-black dark:text-white"
          >
            Confirm Password
          </label>
          <div className="relative flex items-center">
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
              className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
            />
          </div>
        </div>
        <button
          type="submit"
          className={`w-full px-4 py-2 text-white rounded-md shadow focus:outline-none focus:ring-2 ${
            isPasswordMatch
              ? 'bg-primary hover:bg-opacity-90 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600'
              : 'bg-gray-500 cursor-not-allowed'
          }`}
          disabled={!isPasswordMatch}
        >
          Reset Password
        </button>
      </form>

      {/* Back to Login Button */}
      {!isBackButtonDisabled && (
        <button
          type="button"
          onClick={handleBackButtonClick}
          className="mt-4 w-full px-4 py-2 text-white rounded-md bg-gray-500 hover:bg-opacity-90 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          Back to Login
        </button>
      )}

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
            <h2 className="text-lg font-bold text-center">Are you sure?</h2>
            <div className="mt-4 flex justify-between">
              <button
                onClick={handleConfirmBack}
                className="px-4 py-2 text-white bg-red-500 rounded-md"
              >
                Yes
              </button>
              <button
                onClick={handleCancelBack}
                className="px-4 py-2 text-white bg-green-500 rounded-md"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResetPassword;
