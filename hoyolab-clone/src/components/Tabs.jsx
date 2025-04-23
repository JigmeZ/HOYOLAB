import { useState, useEffect } from 'react';
import { fetchPosts, fetchEvents } from '../api/api';
import './Tabs.css';

const Tabs = () => {
  const [active, setActive] = useState('Following');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [posts, setPosts] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.querySelector('.navbar'); // Assuming the navbar has this class
      const tabsNav = document.querySelector('.tabs-nav');
      const tabsContainer = document.querySelector('.tabs-container');
      const navbarRect = navbar.getBoundingClientRect();
      const tabsContainerRect = tabsContainer.getBoundingClientRect();

      // Fix tabs-nav when it touches the bottom of the navbar
      if (tabsContainerRect.top <= navbarRect.bottom) {
        tabsNav.style.position = 'fixed';
        tabsNav.style.top = `${navbarRect.bottom}px`;
        tabsNav.style.width = '47vw'; // Match the width of tabs-container
        tabsNav.style.zIndex = '1000';
      } else {
        tabsNav.style.position = 'relative';
        tabsNav.style.top = 'unset';
        tabsNav.style.width = 'auto';
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (active === 'Recommended') {
      fetchPosts().then(setPosts);
    } else if (active === 'Events') {
      fetchEvents().then(setEvents);
    }
  }, [active]);

  const tabs = ['Following', 'Recommended', 'Events'];
  const dropdownOptions = [
    'Genshin Impact',
    'Honkai: Star Rail',
    'Zenless Zone Zero',
    'HoYoLAB',
    'Honkai Impact 3rd',
    'Tears of Themis',
  ];

  const renderContent = () => {
    if (active === 'Following') {
      return (
        <div className="tab-content following-content">
          <img src="7.jpg" alt="Empty Box" className="empty-box-image" />
          <p className="following-text">Log in to discover more interesting content</p>
          <button className="login-btn">Log in</button>
        </div>
      );
    } else if (active === 'Recommended') {
      return (
        <div className="recommended-container">
          {posts.map((post) => (
            <div key={post.id} className="recommended-card">
              <div className="user-info">
                <span className="user-name">{post.user}</span>
                <span className="post-text">{post.content}</span>
              </div>
              <div className="post-meta">
                <span>❤️ {post.likes}</span>
                <span>💬 {post.comments}</span>
                <span>👁️ {post.views}</span>
              </div>
            </div>
          ))}
        </div>
      );
    } else if (active === 'Events') {
      return (
        <div className="events-container">
          {events.map((event) => (
            <div key={event.id} className="event-card">
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <span>{event.date}</span>
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <div className={`tabs-container ${isScrolled ? 'scrolled' : ''}`}>
      {active === 'Events' && (
        <div className="dropdown">
          <button
            className="dropdown-button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            Genshin Impact <span className="dropdown-icon">▾</span>
          </button>
          {dropdownOpen && (
            <ul className="dropdown-menu">
              {dropdownOptions.map((option, index) => (
                <li key={index} className="dropdown-item">
                  {option}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="tabs-nav" style={{ position: 'relative' }}>
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`tab-button ${active === tab ? 'active' : ''}`}
            onClick={() => setActive(tab)}
          >
            {tab}
            {active === tab && <span className="tab-underline"></span>}
          </button>
        ))}
      </div>

      <div className="tabs-content">{renderContent()}</div>
    </div>
  );
};

export default Tabs;

