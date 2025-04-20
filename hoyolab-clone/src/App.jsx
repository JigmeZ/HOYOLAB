import './App.css'
import Navbar from './components/Navbar'
import Tabs from './components/Tabs';
import Sidebar from './Components/Sidebar'

function App() {
  return (
    <>
      <Navbar />

      <Tabs />
      
      <div className="app-layout"> {/* Updated layout */}
        <Sidebar /> {/* Sidebar moved to the left */}
        <main className="main-content"> {/* Main content comes after Sidebar */}
          <h1>..............................................</h1>
          <p></p>
        </main>
      </div>
    </>
  )
}

export default App