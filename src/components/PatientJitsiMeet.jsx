import React, { useRef, useEffect, useState } from "react";
import { JaaSMeeting } from "@jitsi/react-sdk";
import { MessageSquare, MessageSquareOff, User } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection

const PatientJitsiMeet = () => {
  const jitsiApiRef = useRef(null);
  const [chatVisible, setChatVisible] = useState(false);
  const navigate = useNavigate(); // Initialize navigate function

  // Toggle Chat Function
  const toggleChat = () => {
    if (jitsiApiRef.current) {
      jitsiApiRef.current.executeCommand("toggleChat");
      setChatVisible(!chatVisible);
    }
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Jitsi Meet Video Call */}
      <JaaSMeeting
        appId="vpaas-magic-cookie-c85c2e0743c543eca03932757a05a554"
        domain="8x8.vc"
        roomName="TelemedRoom"
        jwt="eyJraWQiOiJ2cGFhcy1tYWdpYy1jb29raWUtYzg1YzJlMDc0M2M1NDNlY2EwMzkzMjc1N2EwNWE1NTQvNjBhNWJjLVNBTVBMRV9BUFAiLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJqaXRzaSIsImlzcyI6ImNoYXQiLCJpYXQiOjE3MzkzMDM4NjksImV4cCI6MTczOTMxMTA2OSwibmJmIjoxNzM5MzAzODY0LCJzdWIiOiJ2cGFhcy1tYWdpYy1jb29raWUtYzg1YzJlMDc0M2M1NDNlY2EwMzkzMjc1N2EwNWE1NTQiLCJjb250ZXh0Ijp7ImZlYXR1cmVzIjp7ImxpdmVzdHJlYW1pbmciOmZhbHNlLCJvdXRib3VuZC1jYWxsIjp0cnVlLCJzaXAtb3V0Ym91bmQtY2FsbCI6ZmFsc2UsInRyYW5zY3JpcHRpb24iOnRydWUsInJlY29yZGluZyI6ZmFsc2V9LCJ1c2VyIjp7ImhpZGRlbi1mcm9tLXJlY29yZGVyIjpmYWxzZSwibW9kZXJhdG9yIjp0cnVlLCJuYW1lIjoiaGFyZGlrdmFzdWRldi51bml2ZXJzZSIsImlkIjoiZ29vZ2xlLW9hdXRoMnwxMDM0MTg4MDQxNTg3NTM0MjY1NTYiLCJhdmF0YXIiOiIiLCJlbWFpbCI6ImhhcmRpa3Zhc3VkZXYudW5pdmVyc2VAZ21haWwuY29tIn19LCJyb29tIjoiKiJ9.kkUt0PA8zMztHDQwxG66V--1uXYbwBDzBAgpLXuRhStGATm-U9DuG8ClMm8D9rLtCVSIoEvHH23qgdteUQ4WHVVTkp7xnskhQYuyvB5zbP8ZkVE3od_eNhehyqK8WqVoEywoDwnt3reictpIHCxHQ30RWHyS0W46_Pl-HwpubCWAKFE81cD_STQh8V22OC5IYskvfffUY8OTkYeOXPjZI-6O-OiXa2Q5rAmC6c_f1Dz7eGQhC8ruAgtap7rQLX2qk1MqSbUl4M4d9GPEEAEzb46PR4GJKp3iNyEnBD_pbIjNGEK1VAD0JnjbgMUXSWsvaIMNp5b7nkPBhSV5JnRYDg"
        configOverwrite={{
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          disableModeratorIndicator: true,
          disableRecordAudioNotification: true,
          disableInviteFunctions: true,
          disableThirdPartyRequests: true,
          prejoinPageEnabled: false,
          startScreenSharing: false,
          recordingServiceEnabled: false,
          disableSelfView: false,
        }}
        interfaceConfigOverwrite={{
          TOOLBAR_BUTTONS: ["microphone", "camera", "tileview", "hangup"],
          MOBILE_APP_PROMO: false,
          VIDEO_LAYOUT_FIT: "both",
        }}
        userInfo={{
          displayName: "Patient",
        }}
        onApiReady={(externalApi) => {
          jitsiApiRef.current = externalApi;

          // Listen for hang-up event and redirect to Main Menu
          externalApi.addEventListener("videoConferenceLeft", () => {
            navigate("/menu"); // Ensure this matches your route setup
        });
        
        }}
        getIFrameRef={(iframeRef) => {
          iframeRef.style.width = "100%";
          iframeRef.style.height = "100%";
          iframeRef.style.border = "none";
        }}
      />

      {/* Chat Toggle Button (Bottom Right) */}
      <button
        className="absolute bottom-6 right-6 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 hover:bg-green-700 transition"
        onClick={toggleChat}
      >
        {chatVisible ? <MessageSquareOff size={20} /> : <MessageSquare size={20} />}
        {chatVisible ? "Hide Chat" : "Show Chat"}
      </button>

      {/* Patient Icon (Top Left) */}
      <div className="absolute top-4 left-4 flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow">
        <User size={24} className="text-gray-700" />
        <span className="text-gray-900 font-medium">Patient</span>
      </div>
    </div>
  );
};

export default PatientJitsiMeet;