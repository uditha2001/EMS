import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Axios } from '../../common/Axios';
import Loader from '../../common/Loader';
const OTPVerification = () => {
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [resetError, setResetError] = useState(false);
  const [submitFailed, setSubmitFailed] = useState(false);
  const [resetFailed, setResetFailed] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const currentTime = localStorage.getItem('time');
  const [timeRemaining, setTimeRemaining] = useState(
    parseInt(currentTime ? currentTime : '120'),
  ); // 2 minutes = 120 seconds
  const [isOtpExpired, setIsOtpExpired] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const username = location.state?.username;

  useEffect(() => {
    let timer: any;
    if (timeRemaining > 0) {
      // Update countdown every second
      timer = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);
    } else {
      setIsOtpExpired(true); // OTP expired
      clearInterval(timer);
    }
    localStorage.setItem('time', JSON.stringify(timeRemaining));

    return () => clearInterval(timer); // Clean up the timer on unmount
  }, [timeRemaining]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return; // Only allow numbers
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if a number is entered
    if (value && index < otp.length - 1) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    try {
      setLoadingStatus(true);
      const response = await Axios.post(
        `login/otpValidate?enteredOtp=${enteredOtp}&username=${username}`,
      );
      if (response.data.code === 200) {
        setLoadingStatus(false);
        navigate('/reset-password', { state: { username } });
      } else if (response.data.code === 304) {
        setLoadingStatus(false);
        setSubmitFailed(true);
      }
    } catch (err) {
      setLoadingStatus(false);
      setSubmitFailed(true);
      console.error('Invalid OTP');
    }
  };

  const handleReset = async () => {
    // Reset OTP fields, timer, and expiry state
    setOtp(Array(6).fill(''));
    try {
      setLoadingStatus(true);
      Axios.post(`login/verifyuser?username=${username}`)
        .then((res) => {
          if (res.data.code === 200) {
            setLoadingStatus(false);
            setResetFailed(false);
            setTimeRemaining(120); // Reset to 2 minutes
            setIsOtpExpired(false);
          } else if (res.data.code === 404) {
            setLoadingStatus(false);
            setIsOtpExpired(false);
            setResetFailed(true);
          }
        })
        .catch(() => {
          setLoadingStatus(false);
          setResetError(true);
          setIsOtpExpired(false);
          setResetFailed(true);
          console.error('error occur');
        });
      console.log(`Sending OTP to ${username}`);
    } catch (err) {
      setLoadingStatus(false);
      setResetError(true);
      console.error('Failed to send OTP');
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div>
      {loadingStatus ? <Loader /> : null}
      <h1 className="text-xl font-bold text-gray-800 dark:text-white text-center mb-6">
        Verify OTP
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {submitFailed && !resetFailed ? (
          <p className="text-red-500 text-center">
            Invalid OTP. Please try again.
          </p>
        ) : null}
        {resetError && resetFailed && (
          <p className="text-red-500 text-center">
            Failed to send OTP. Please try again.
          </p>
        )}

        {/* Display OTP expiration message */}
        {isOtpExpired && (
          <p className="text-red-500 text-center">
            OTP has expired. Please request a new one.
          </p>
        )}

        {/* Timer display */}
        {!isOtpExpired && (
          <p className="text-center">
            Time remaining: {formatTime(timeRemaining)}
          </p>
        )}

        <div className="flex justify-center gap-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              required
              className="w-12 h-12 text-center rounded border border-stroke bg-gray text-black text-xl focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
              disabled={isOtpExpired} // Disable inputs if OTP expired
            />
          ))}
        </div>

        {/* Submit button */}
        {!isOtpExpired && !resetError ? (
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-primary rounded-md shadow hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Verify OTP
          </button>
        ) : (
          <button
            type="button"
            onClick={handleReset}
            className="w-full px-4 py-2 text-white bg-secondary rounded-md shadow hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Request New OTP
          </button>
        )}
      </form>
    </div>
  );
};

export default OTPVerification;
