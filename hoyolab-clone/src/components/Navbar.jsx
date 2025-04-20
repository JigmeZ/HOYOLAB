import './Navbar.css'
import { useState, useEffect } from 'react'
import { FaSearch, FaPen, FaBell } from 'react-icons/fa'
import profileImage from '../assets/profile.jpg'

function Navbar() {
  const [activeLink, setActiveLink] = useState('home')
  const [placeholder, setPlaceholder] = useState('Check in')
  const [placeholderClass, setPlaceholderClass] = useState('placeholder-fade-in')
  const [searchQuery, setSearchQuery] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderClass('placeholder-fade-out')
      setTimeout(() => {
        setPlaceholder((prev) => (prev === 'Check in' ? 'Trending' : 'Check in'))
        setPlaceholderClass('placeholder-fade-in')
      }, 500)
    }, 3000)

    return () => {
      clearInterval(interval) // Ensure the interval is cleared on component unmount
    }
  }, [])

  const handleSearchFocus = () => {
    setShowDropdown(true) // Show dropdown when the search bar is focused
  }

  const handleSearchBlur = () => {
    setTimeout(() => setShowDropdown(false), 200) // Hide dropdown after a delay
  }

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
            className={placeholderClass}
            value={searchQuery}
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="search-icon">
            <FaSearch />
          </span>
          {showDropdown && (
            <div className="search-dropdown">
              <div className="dropdown-section">
                <div className="dropdown-header">
                  Search history <span className="clear-btn">Clear</span>
                </div>
                <ul>
                  <li>Check in</li>
                </ul>
              </div>
              <hr />
              <div className="dropdown-section">
                <div className="dropdown-header">Trending</div>
                <ul>
                  <li>The Chrysos Heir</li>
                  <li>Check in</li>
                </ul>
              </div>
            </div>
          )}
        </div>
        <div className="post-icon">
          <FaPen />
        </div>
        <div className="notification-icon">
          <FaBell />
        </div>
        <div className="profile-icon">
          <img src={profileImage} alt="Profile" />
        </div>
      </div>
    </nav>
  )
}

export default Navbar