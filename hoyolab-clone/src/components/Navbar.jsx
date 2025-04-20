import './Navbar.css';
import { useState, useEffect } from 'react';
import { FaSearch, FaPen, FaBell } from 'react-icons/fa';
import profileImage from '../assets/profile.jpg';

function Navbar() {
  const [activeLink, setActiveLink] = useState('home');
  const [placeholder, setPlaceholder] = useState('Check in');
  const [placeholderClass, setPlaceholderClass] = useState('placeholder-fade-in');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showTriangleDropdown, setShowTriangleDropdown] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderClass('placeholder-fade-out');
      setTimeout(() => {
        setPlaceholder((prev) => (prev === 'Check in' ? 'Trending' : 'Check in'));
        setPlaceholderClass('placeholder-fade-in');
      }, 500);
    }, 3000);

    return () => {
      clearInterval(interval); // Ensure the interval is cleared on component unmount
    };
  }, []);

  const toggleTriangleDropdown = () => {
    setShowTriangleDropdown((prev) => {
      if (!prev) setShowSearchDropdown(false); // Close search dropdown
      return !prev;
    });
  };

  const handleSearchFocus = () => {
    setShowSearchDropdown(true); // Show search dropdown when the search bar is focused
    setShowTriangleDropdown(false); // Close triangle dropdown
  };

  const handleSearchBlur = () => {
    setTimeout(() => setShowSearchDropdown(false), 200); // Hide search dropdown after a delay
  };

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
          <div
            className="user-icon"
            onClick={toggleTriangleDropdown} // Toggle dropdown on blue circle click
          >
            🔵
          </div>
          <span
            className={`dropdown-icon ${showTriangleDropdown ? 'rotated' : ''}`}
            onClick={toggleTriangleDropdown} // Toggle dropdown on triangle click
          >
            ▼
          </span>
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
          {showSearchDropdown && (
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
          {showTriangleDropdown && (
            <div className="triangle-dropdown">
              <div className="dropdown-header">
                <div className="dropdown-icon">🔵</div>
                <span>All</span>
              </div>
              <ul>
                <li>
                  <img src="path/to/genshin-icon.png" alt="GenshinImpact" />
                  GenshinImpact
                </li>
                <li>
                  <img src="path/to/honkai-icon.png" alt="Honkai:StarRail" />
                  Honkai:StarRail
                </li>
                <li>
                  <img src="path/to/zenless-icon.png" alt="ZenlessZoneZero" />
                  ZenlessZoneZero
                </li>
                <li>
                  <img src="path/to/hoyolab-icon.png" alt="HoYoLAB" />
                  HoYoLAB
                </li>
                <li>
                  <img src="path/to/honkai3rd-icon.png" alt="Honkai Impact 3rd" />
                  Honkai Impact 3rd
                </li>
                <li>
                  <img src="path/to/tears-icon.png" alt="TearsOfThemis" />
                  TearsOfThemis
                </li>
              </ul>
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
  );
}

export default Navbar;