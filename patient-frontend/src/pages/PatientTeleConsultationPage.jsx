import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import JitsiMeetComponent from "../components/PatientJitsiMeet";

const PatientTeleConsultationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve JWT and condition from navigation state (from WaitingScreen)
  const { jwt, condition } = location.state || { jwt: "", condition: "General" };

  const goToMainMenu = () => {
    navigate("/menu");
  };

  if (!jwt) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-xl font-semibold">Loading teleconsultation...</p>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-black overflow-hidden">
      {/* Jitsi Video Call taking up the full screen */}
      <div className="w-full h-full">
        <JitsiMeetComponent jwt={jwt} condition={condition} />
      </div>

      {/* Main Menu Button (Bottom Right Corner) */}
      <button
        onClick={goToMainMenu}
        className="fixed bottom-4 right-4 bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg"
      >
        Main Menu
      </button>
    </div>
  );
};

export default PatientTeleConsultationPage;
