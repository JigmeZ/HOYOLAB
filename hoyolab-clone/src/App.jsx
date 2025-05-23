import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Tabs from './components/Tabs';
import Sidebar from './components/Sidebar';
import InterestGroup from './pages/InterestGroup';
import SearchPage from './pages/SearchPage';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Tabs />
              <div className="app-layout">
                <Sidebar />
                <main className="main-content">
                  {/* Main content area */}
                </main>
              </div>
            </>
          }
        />
        <Route path="/interest-group" element={<InterestGroup />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </Router>
  );
}

export default App;