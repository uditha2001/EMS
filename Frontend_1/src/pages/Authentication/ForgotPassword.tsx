import { Axios } from '../../common/Axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [username, setUserName] = useState('');
  const [error, setError] = useState(false);
  const [failed, setFailed] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      Axios.post(`login/verifyuser?username=${username}`)
        .then((res) => {
          console.log(res.status);
          if (res.status === 200) {
            navigate('/otp-verification', { state: { username } });
          }
          else if (res.status === 404) {
            setFailed(true);
          }

        })
        .catch(() => {
          setError(true);
          setUserName('');
          console.error("error occur");
        });
      console.log(`Sending OTP to ${username}`);
    } catch (err) {
      setError(true);
      setUserName('');
      console.error('Failed to send OTP');
    }
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 360 240"
                xmlSpace="preserve"
                className="w-14 h-14"
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
    </div >
  );
};

export default ForgotPassword;
