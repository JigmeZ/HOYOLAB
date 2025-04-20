import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Tabs from './components/Tabs';
import Sidebar from './components/Sidebar';
import InterestGroup from './pages/InterestGroup';

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
                  <h1>Welcome to Hoyolab Clone</h1>
                  <p>Explore the features of Hoyolab.</p>
                </main>
              </div>
            </>
          }
        />
        <Route path="/interest-group" element={<InterestGroup />} />
      </Routes>
    </Router>
  );
}

export default App;