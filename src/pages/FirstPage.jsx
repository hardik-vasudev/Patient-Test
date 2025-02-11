import { useState } from "react";
import TextInput from "../components/TextInput";
import KioskButton from "../components/KioskButton";
import EmergencyReset from "../components/EmergencyReset";

const FirstPage = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [reason, setReason] = useState("");

  const goNext = () => setStep(step + 1);
  const skipToOptions = () => setStep(4);
  const resetForm = () => {
    setStep(1);
    setName("");
    setAge("");
    setReason("");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-blue-50 p-6">
      <h1 className="text-3xl font-bold text-blue-700">Welcome to Bharat Telemed</h1>

      {step === 1 && (
        <div className="mt-6 w-80">
          <TextInput label="Type Your Name:" value={name} onChange={(e) => setName(e.target.value)} />
          <KioskButton text="Next" onClick={goNext} color="green" />
          <KioskButton text="Skip" onClick={skipToOptions} color="gray" />
        </div>
      )}

      {step === 2 && (
        <div className="mt-6 w-80">
          <TextInput label="Enter Your Age:" value={age} onChange={(e) => setAge(e.target.value)} />
          <KioskButton text="Next" onClick={goNext} color="green" />
        </div>
      )}

      {step === 3 && (
        <div className="mt-6 w-80">
          <TextInput label="What brings you here?" value={reason} onChange={(e) => setReason(e.target.value)} />
          <KioskButton text="Proceed" onClick={goNext} color="green" />
        </div>
      )}

      {step === 4 && (
        <div className="mt-6 w-80 grid grid-cols-2 gap-4">
          <KioskButton text="🩺 Teleconsultation" onClick={() => {}} />
          <KioskButton text="🤖 AI Doctor" onClick={() => {}} />
          <KioskButton text="💬 JivanAI Chatbot" onClick={() => {}} />
          <KioskButton text="🔑 Patient Login" onClick={() => {}} />
        </div>
      )}

      <EmergencyReset onReset={resetForm} onEmergency={() => alert("Emergency Contact Triggered!")} />
    </div>
  );
};

export default FirstPage;
