const KioskButton = ({ text, onClick, color = "blue" }) => {
    return (
      <button
        onClick={onClick}
        className={`p-3 text-white rounded-md text-lg w-full mt-2 bg-${color}-500`}
      >
        {text}
      </button>
    );
  };
  
  export default KioskButton;
  