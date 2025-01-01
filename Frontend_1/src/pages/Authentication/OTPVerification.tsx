import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const OTPVerification = () => {
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

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
      // Call API to verify OTP
      // Example: await AuthService.verifyOTP(email, enteredOtp);
      console.log(`Verifying OTP: ${enteredOtp} for ${email}`);
      navigate('/reset-password', { state: { email } });
    } catch (err) {
      setError(true);
      console.error('Invalid OTP');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-center mb-6 dark:text-white">
        Verify OTP
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="text-red-500 text-center">
            Invalid OTP. Please try again.
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
            />
          ))}
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-primary rounded-md shadow hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          Verify OTP
        </button>
      </form>
    </div>
  );
};

export default OTPVerification;
