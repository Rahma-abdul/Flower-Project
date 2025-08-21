import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import MainPage from "./pages/MainPage";
import InfoPage from "./pages/InfoPage";
import UploadPage from "./pages/UploadPage";
import AdvicePage from "./pages/AdvicePage";
import QuizPage from "./pages/QuizPage";


function App() {

  return (
    <Router>
      <div> <h1>🌸 Flower Project 🌸</h1> </div>
      <nav className = "navbar">
        <Link to="/">Home</Link> |{" "}
        <Link to="/upload">Upload</Link> |{" "}
        <Link to="/advice">Advice</Link> |{" "}
        <Link to="/quiz">Quiz</Link>
      </nav>
      <Routes>
        <Route path="/" element={<MainPage />} />
        {/* <Route path="/info" element={<InfoPage />} /> */}
        <Route path="/info/:id" element={<InfoPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/advice" element={<AdvicePage />} />
        <Route path="/quiz" element={<QuizPage />} />
      </Routes>
    </Router>
  );
}

export default App;


// To do next: 
// Icon and Site Name
// Add flower images
// Flower card styling 
// Whole page styling