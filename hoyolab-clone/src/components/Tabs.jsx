import { useState, useEffect } from 'react';
import './Tabs.css';
import LoginPage from '../pages/LoginPage';
import { fetchPosts, fetchEvents } from '../api/api';

const Tabs = () => {
  const [active, setActive] = useState('Following');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
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
    // Fetch posts and events from RESTful API
    fetchPosts().then(setPosts).catch(() => setPosts([]));
    fetchEvents().then(setEvents).catch(() => setEvents([]));
  }, []);

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
          <button className="login-btn" onClick={() => setShowLogin(true)}>Log in</button>
          {showLogin && <LoginPage onClose={() => setShowLogin(false)} />}
        </div>
      );
    } else if (active === 'Recommended') {
      return (
        <div className="recommended-container">
          {posts.length === 0 ? (
            <div>No posts available.</div>
          ) : (
            posts.map((post, idx) => (
              <div className="recommended-card" key={post.id || idx}>
                <div className="user-info">
                  <img src={post.avatar || "3.jpg"} alt="User Avatar" className="user-avatar" />
                  <div className="user-details">
                    <span className="user-name">{post.username}</span>
                    <span className="user-meta">{post.time} • {post.category}</span>
                  </div>
                  <div className="user-actions">
                    <button className="follow-button">Follow</button>
                    <span className="three-dots">⋮</span>
                  </div>
                </div>
                <p className="post-text">{post.text}</p>
                {post.images && (
                  <div className="post-images">
                    {post.images.map((img, i) => (
                      <img src={img} alt={`Post Image ${i + 1}`} className="post-image" key={i} />
                    ))}
                  </div>
                )}
                <div className="post-meta">
                  <div className="views">
                    <span className="icon">👁️</span> {post.views}
                  </div>
                  <div className="actions">
                    <div className="comments">
                      <span className="icon">💬</span> {post.comments}
                    </div>
                    <div className="emotes">
                      <span className="emote">👍</span>
                      <span className="emote">🎉</span>
                    </div>
                    <div className="likes">
                      <span className="icon">❤️</span> {post.likes}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      );
    } else if (active === 'Events') {
      return (
        <div className="events-container">
          {events.length === 0 ? (
            <div>No events available.</div>
          ) : (
            events.map((event, idx) => (
              <div className="event-card" key={event.id || idx}>
                <span className={`event-status ${event.status === 'ended' ? 'ended' : 'in-progress'}`}>
                  {event.status === 'ended' ? 'Already Ended' : 'In Progress'}
                </span>
                <img src={event.image} alt={event.title} className="event-image" />
                <div className="event-details">
                  <h3>{event.title}</h3>
                  <p>{event.description}</p>
                  <span className="event-date">{event.date}</span>
                </div>
              </div>
            ))
          )}
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