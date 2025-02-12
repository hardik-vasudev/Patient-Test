import React from "react";
import { useNavigate } from "react-router-dom";
import LandingButtons from "../components/LandingButtons"; // Importing the button component

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold text-green-700 mb-6 animate-fadeIn">
        Welcome to Bharat-Telemed
      </h1>

      {/* Emergency button is inside LandingButtons */}
      <LandingButtons onStart={() => navigate("/steps")} />
    </div>
  );
};

export default LandingPage;
