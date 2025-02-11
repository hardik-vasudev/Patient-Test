import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../components/InputField";

const StepsPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [userData, setUserData] = useState({
    name: "",
    age: "",
    reason: "",
  });

  const questions = [
    { key: "name", text: "What is your name?" },
    { key: "age", text: "How old are you?" },
    { key: "reason", text: "What brings you here today?" },
  ];

  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      navigate("/menu");
    }
  };

  const handleSkip = () => {
    navigate("/menu");
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-100">
      {/* Reset Button (Always Visible) */}
      <button
        onClick={() => navigate("/")}
        className="absolute bottom-4 right-4 bg-gray-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-700"
      >
        Reset
      </button>

      {/* Dynamic Input Field */}
      <InputField
        question={questions[step].text}
        value={userData[questions[step].key]}
        onChange={(value) =>
          setUserData({ ...userData, [questions[step].key]: value })
        }
        onNext={handleNext}
        onSkip={handleSkip}
      />
    </div>
  );
};

export default StepsPage;
