interface ButtonProps {
    ButtonName: string;
  }
  
  const Button1: React.FC<ButtonProps> = ({ ButtonName }) => {
    return (
      <button
        type="button"
        className="rounded-md bg-blue-900 px-10 py-3 text-white hover:bg-blue-800 duration-700"
      >
        {ButtonName}
      </button>
    );
  };
  
  export default Button1;
  