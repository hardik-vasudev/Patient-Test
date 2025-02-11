import React from "react";

const LandingButtons = ({ onStart }) => {
  return (
    <div className="fixed w-full h-full flex justify-between p-4">
      {/* Emergency Button (Top Right) */}
      <button className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-700">
        Emergency
      </button>

      {/* Reset Button (Bottom Right) */}
      <button className="absolute bottom-4 right-4 bg-gray-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-700">
        Reset
      </button>

      {/* Start Button (Centered) */}
      <div className="w-full h-full flex flex-col items-center justify-center">
        <button
          onClick={onStart}
          className="bg-green-600 text-white text-lg font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-green-700 transition-all duration-300 mt-10"
        >
          Start
        </button>
      </div>
    </div>
  );
};

export default LandingButtons;
