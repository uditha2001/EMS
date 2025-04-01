
type passwordConfirmProps = {

  onConfirm: (password: string) => void;
  onCancel: () => void;
};
const PasswordConfirm =({ onConfirm, onCancel }: passwordConfirmProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-xl">
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            autoFocus
          />
        </div>

        <div className="flex justify-end space-x-2">
          
          <button
          onClick={() => {
            const passwordInput = document.getElementById('password') as HTMLInputElement;
            if (passwordInput) {
              onConfirm(passwordInput.value);
            }
            else{
              console.error("Password input not found");
            }
          }}
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Confirm
          </button>
          <button
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default PasswordConfirm