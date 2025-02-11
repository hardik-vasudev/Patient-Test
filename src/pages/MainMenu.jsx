import React from "react";
import { useNavigate } from "react-router-dom";
import { FaVideo, FaRobot, FaUserMd, FaUser } from "react-icons/fa";

const MainMenu = () => {
  const navigate = useNavigate();

  const menuItems = [
    { id: 1, label: "Teleconsultation", icon: <FaVideo size={50} />, route: "/teleconsultation", bgColor: "bg-blue-100", hoverColor: "hover:bg-blue-200" },
    { id: 2, label: "AI Doctor", icon: <FaUserMd size={50} />, route: "/ai-doctor", bgColor: "bg-green-100", hoverColor: "hover:bg-green-200" },
    { id: 3, label: "JivanAI Chatbot", icon: <FaRobot size={50} />, route: "/jivanai", bgColor: "bg-yellow-100", hoverColor: "hover:bg-yellow-200" },
    { id: 4, label: "Patient Login", icon: <FaUser size={50} />, route: "/patient-login", bgColor: "bg-red-100", hoverColor: "hover:bg-red-200" },
  ];

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 relative">
      {/* Heading */}
      <h1 className="text-4xl font-extrabold text-green-700 mb-10 tracking-wide shadow-sm">Main Menu</h1>

      {/* Grid Layout */}
      <div className="grid grid-cols-2 gap-6">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.route)}
            className={`flex flex-col items-center justify-center p-6 rounded-xl shadow-xl transition-transform transform hover:scale-105 duration-300 ${item.bgColor} ${item.hoverColor}`}
          >
            {item.icon}
            <span className="mt-3 text-lg font-semibold text-gray-800">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Reset Button (Bottom Right) */}
      <button
        onClick={() => navigate("/")}
        className="absolute bottom-4 right-4 bg-gray-700 text-white px-5 py-2 rounded-lg shadow-md hover:bg-gray-800 transition-all duration-300"
      >
        Reset
      </button>
    </div>
  );
};

export default MainMenu;
