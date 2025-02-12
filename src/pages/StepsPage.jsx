import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const commonDiseases = [
  "Fever",
  "Cough & Cold",
  "Headache",
  "Stomach Pain",
  "Dental Issues",
  "Other",
];

const StepsPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [userData, setUserData] = useState({
    name: "",
    age: "",
    reason: "",
    customReason: "",
  });

  const questions = [
    { key: "name", text: "What is your name?", type: "text" },
    { key: "age", text: "How old are you?", type: "number" },
    { key: "reason", text: "Select your concern", type: "dropdown" },
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
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-gray-50 p-6 relative">
      {/* Reset Button */}
      <button
        onClick={() => navigate("/")}
        className="absolute bottom-4 right-4 bg-gray-700 text-white px-5 py-2 rounded-lg shadow-md hover:bg-gray-800 transition-all"
      >
        Reset
      </button>

      {/* Dynamic Input Field */}
      <div className="w-full max-w-md text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          {questions[step].text}
        </h2>

        {questions[step].type === "text" || questions[step].type === "number" ? (
          <input
            type={questions[step].type}
            value={userData[questions[step].key]}
            onChange={(e) =>
              setUserData({ ...userData, [questions[step].key]: e.target.value })
            }
            className="w-full border-b-2 border-gray-400 focus:outline-none focus:border-blue-500 text-lg py-2"
          />
        ) : (
          <>
            <select
              value={userData.reason}
              onChange={(e) =>
                setUserData({ ...userData, reason: e.target.value, customReason: "" })
              }
              className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select an option</option>
              {commonDiseases.map((disease, index) => (
                <option key={index} value={disease}>{disease}</option>
              ))}
            </select>
            {userData.reason === "Other" && (
              <input
                type="text"
                placeholder="Enter your condition"
                value={userData.customReason}
                onChange={(e) =>
                  setUserData({ ...userData, customReason: e.target.value })
                }
                className="w-full border-b-2 border-gray-400 mt-3 focus:outline-none focus:border-blue-500 text-lg py-2"
              />
            )}
          </>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={handleSkip}
          className="bg-gray-500 text-white px-5 py-2 rounded-lg shadow-md hover:bg-gray-600 transition-all"
        >
          Skip
        </button>
        <button
          onClick={handleNext}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-all"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default StepsPage;