type passwordConfirmProps = {
  onConfirm: (password: string) => void;
  onCancel: () => void;
};
const PasswordConfirm = ({ onConfirm, onCancel }: passwordConfirmProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded p-6 w-full max-w-sm shadow-xl">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Confirm Password
        </h3>

        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-2 sr-only"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            className="input-field"
            autoFocus
          />
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={() => {
              const passwordInput = document.getElementById(
                'password',
              ) as HTMLInputElement;
              if (passwordInput) {
                onConfirm(passwordInput.value);
              } else {
                console.error('Password input not found');
              }
            }}
            className="btn-primary"
          >
            Confirm
          </button>
          <button className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordConfirm;
