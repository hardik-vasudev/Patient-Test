import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import StepsPage from "./pages/StepsPage";
import MainMenu from "./pages/MainMenu";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/steps" element={<StepsPage />} />
        <Route path="/menu" element={<MainMenu />} />
      </Routes>
    </Router>
  );
}

export default App;
