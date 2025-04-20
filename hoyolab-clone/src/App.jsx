import './App.css'
import Navbar from './components/Navbar'
import Sidebar from './Components/Sidebar'

function App() {
  return (
    <>
      <Navbar />
      <div className="app-layout"> {/* Updated layout */}
        <Sidebar /> {/* Sidebar moved to the left */}
        <main className="main-content"> {/* Main content comes after Sidebar */}
          <h1>Welcome to Hoyolab Clone</h1>
          <p>Explore the features of Hoyolab.</p>
        </main>
      </div>
    </>
  )
}

export default App