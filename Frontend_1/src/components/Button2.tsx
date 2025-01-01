interface ButtonProps {
    ButtonName: string;
  }
  
  const Button2: React.FC<ButtonProps> = ({ ButtonName }) => {
    return (
      <button
        type="button"
        className="rounded-2xl bg-blue-700 px-4 py-2 text-white hover:bg-blue-400 duration-300"
      >
        {ButtonName}
      </button>
    );
  };
  
  export default Button2;
  