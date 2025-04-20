import { useState, useEffect } from 'react';
import './Tabs.css';

const Tabs = () => {
  const [active, setActive] = useState('Following');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const container = document.querySelector('.tabs-container');
      const rect = container.getBoundingClientRect();
      setIsScrolled(rect.top <= 80); // Adjust based on navbar height
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
        <div className="tab-content">
          <img src="/images/following.png" alt="Following Content" className="tab-image" />
          <p>You are viewing content from people you follow.</p>
        </div>
      );
    } else if (active === 'Recommended') {
      return (
        <div className="recommended-container">
          <div className="recommended-card">
            <div className="user-info">
              <img src="3.jpg" alt="User Avatar" className="user-avatar" />
              <div className="user-details">
                <span className="user-name">ScorpioKyng🪬</span>
                <span className="user-meta">21h ago • Honkai: Star Rail</span>
              </div>
              <div className="user-actions">
                <button className="follow-button">Follow</button>
                <span className="three-dots">⋮</span>
              </div>
            </div>
            <p className="post-text">HOLY DAMN</p>
            <div className="post-images">
              <img src="1.jpg" alt="Post Image 1" className="post-image" />
              <img src="2.jpg" alt="Post Image 2" className="post-image" />
            </div>
            <div className="post-meta">
              <div className="views">
                <span className="icon">👁️</span> 67k
              </div>
              <div className="actions">
                <div className="comments">
                  <span className="icon">💬</span> 119
                </div>
                <div className="emotes">
                  <span className="emote">👍</span>
                  <span className="emote">🎉</span>
                </div>
                <div className="likes">
                  <span className="icon">❤️</span> 1,448
                </div>
              </div>
            </div>
          </div>
          <div className="recommended-card">
            <div className="user-info">
              <img src="5.jpg" alt="User Avatar" className="user-avatar" />
              <div className="user-details">
                <span className="user-name">StarrySky✨</span>
                <span className="user-meta">12h ago • Genshin Impact</span>
              </div>
              <div className="user-actions">
                <button className="follow-button">Follow</button>
                <span className="three-dots">⋮</span>
              </div>
            </div>
            <p className="post-text">Exploring the beauty of Teyvat!</p>
            <div className="post-images">
              <img src="4.jpg" alt="Post Image 1" className="post-image" />
              <img src="6.jpg" alt="Post Image 2" className="post-image" />
            </div>
            <div className="post-meta">
              <div className="views">
                <span className="icon">👁️</span> 45k
              </div>
              <div className="actions">
                <div className="comments">
                  <span className="icon">💬</span> 89
                </div>
                <div className="emotes">
                  <span className="emote">👍</span>
                  <span className="emote">🎉</span>
                </div>
                <div className="likes">
                  <span className="icon">❤️</span> 1,200
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (active === 'Events') {
      return (
        <div className="events-container">
          <div className="event-card">
            <span className="event-status in-progress">In Progress</span>
            <img src="Event 1.jpg" alt="Event 1" className="event-image" />
            <div className="event-details">
              <h3>Primogem Rewards: Participate in Xilonen and Venti's Topic Discussions</h3>
              <p>Join the discussion to get guaranteed avatar frames and Primogems.</p>
              <span className="event-date">2025/04/14 - 2025/04/26</span>
            </div>
          </div>
          <div className="event-card">
            <span className="event-status in-progress">In Progress</span>
            <img src="Event 2.jpg" alt="Event 2" className="event-image" />
            <div className="event-details">
              <h3>Sprint Towards the Finish Line</h3>
              <p>Take part in the Teyvat Sports Contest to win Primogems.</p>
              <span className="event-date">2025/04/02 - 2025/04/20</span>
            </div>
          </div>
          <div className="event-card">
            <span className="event-status in-progress">In Progress</span>
            <img src="Event 3.jpg" alt="Event 3" className="event-image" />
            <div className="event-details">
              <h3>Web Event: Roaming Through the Realm of Saurians</h3>
              <p>Participate to earn Primogems and exclusive rewards.</p>
              <span className="event-date">2025/03/25 - 2025/05/04</span>
            </div>
          </div>
          <div className="event-card">
            <span className="event-status ended">Already Ended</span>
            <img src="Event 4.jpg" alt="Event 4" className="event-image" />
            <div className="event-details">
              <h3>The Night Deepens as Stars Gather Around the Moon</h3>
              <p>Listen to the "Song of the Welkin Moon" for a magical experience.</p>
              <span className="event-date">2025/02/01 - 2025/02/15</span>
            </div>
          </div>
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

      <div className="tabs-nav">
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

