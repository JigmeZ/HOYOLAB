import './Navbar.css'
import { useState, useEffect } from 'react'
import { FaSearch, FaPen, FaBell } from 'react-icons/fa' // Import updated icons

function Navbar() {
  const [activeLink, setActiveLink] = useState('home')
  const [placeholder, setPlaceholder] = useState('Check in')
  const [placeholderClass, setPlaceholderClass] = useState('placeholder-fade-in')

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderClass('placeholder-fade-out') // Start fade-out animation
      setTimeout(() => {
        setPlaceholder((prev) => (prev === 'Check in' ? 'Trending' : 'Check in'))
        setPlaceholderClass('placeholder-fade-in') // Start fade-in animation
      }, 500) // Match the duration of the fade-out animation
    }, 3000) // Change every 3 seconds

    return () => clearInterval(interval) // Cleanup interval on component unmount
  }, [])

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="navbar-logo">HoYoLAB</div>
        <ul className="navbar-links">
          <li>
            <a
              href="#home"
              className={activeLink === 'home' ? 'active' : ''}
              onClick={() => setActiveLink('home')}
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="#interest-group"
              className={activeLink === 'interest-group' ? 'active' : ''}
              onClick={() => setActiveLink('interest-group')}
            >
              Interest Group
            </a>
          </li>
        </ul>
      </div>
      <div className="navbar-right">
        <div className="search-bar">
          <div className="user-icon">🔵</div>
          <span className="dropdown-icon">▼</span>
          <div className="divider"></div>
          <input
            type="text"
            placeholder={placeholder}
            className={placeholderClass} // Dynamically apply fade-in or fade-out class
          />
          <span className="search-icon">
            <FaSearch /> {/* Updated search icon */}
          </span>
        </div>
        <div className="post-icon">
          <FaPen /> {/* Updated to use pen icon */}
        </div>
        <div className="notification-icon">
          <FaBell /> {/* Updated to use bell icon */}
        </div>
        <div className="profile-icon">
          <img src="path/to/profile.jpg" alt="Profile" />
        </div>
      </div>
    </nav>
  )
}

export default Navbar
