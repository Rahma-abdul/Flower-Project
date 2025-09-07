import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import MainPage from "./pages/MainPage";
import InfoPage from "./pages/InfoPage";
import UploadPage from "./pages/UploadPage";
import AdvicePage from "./pages/AdvicePage";
import QuizPage from "./pages/QuizPage";
import "./styles/index.css";


function App() {

  return (
    <Router>
      <div> <h1> <img src="/icon4.png" alt="Flower Logo" className="logo-icon" /> Flower Project <img src="/icon4.png" alt="Flower Logo" className="logo-icon" /></h1> </div>
      <nav className = "navbar">
        <Link to="/" className="element">Home</Link> |{" "}
        <Link to="/upload" className="element">Upload</Link> |{" "}
        <Link to="/advice" className="element">Advice</Link> |{" "}
        <Link to="/quiz" className="element">Quiz</Link>
      </nav>
      <Routes>
        <Route path="/" element={<MainPage />} />
        {/* <Route path="/info" element={<InfoPage />} /> */}
        <Route path="/info/:name" element={<InfoPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/advice" element={<AdvicePage />} />
        <Route path="/quiz" element={<QuizPage />} />
      </Routes>
    </Router>
  );
}

export default App;

