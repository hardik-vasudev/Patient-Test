import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import StepsPage from "./pages/StepsPage";
import MainMenu from "./pages/MainMenu";
import PatientTeleConsultationPage from "./pages/PatientTeleConsultationPage";
import PatientLogin from "./pages/PatientLogin";
import EmergencyPage from "./pages/EmergencyPage"; // Import Emergency Page
import WaitingScreen from "./pages/WaitingScreen"; // Import Waiting Screen

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/steps" element={<StepsPage />} />
        <Route path="/menu" element={<MainMenu />} />
        <Route path="/teleconsultation" element={<PatientTeleConsultationPage />} />
        <Route path="/patientlogin" element={<PatientLogin />} />
        <Route path="/emergency" element={<EmergencyPage />} /> {/* Emergency Route */}
        <Route path="/waiting" element={<WaitingScreen />} /> {/* Waiting Screen Route */}
      </Routes>
    </Router>
  );
}

export default App;
