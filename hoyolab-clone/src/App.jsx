import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Tabs from "./components/Tabs";
import Sidebar from "./components/Sidebar";
import InterestGroup from "./pages/InterestGroup";
import SearchPage from "./pages/SearchPage";
import Profile from "./components/Profile";
import { pingBackend } from "./api/api";

function App() {
  const [pingResult, setPingResult] = useState(null);

  const handlePing = async () => {
    try {
      const res = await pingBackend();
      setPingResult(JSON.stringify(res));
    } catch (e) {
      setPingResult("Error: " + e.message);
    }
  };

  return (
    <Router>
      <Navbar onLogoClick={handlePing} />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Tabs />
              <div className="app-layout">
                <Sidebar />
              </div>
            </>
          }
        />
        <Route path="/profile" element={<Profile />} />
        <Route path="/interest-group" element={<InterestGroup />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </Router>
  );
}

export default App;
