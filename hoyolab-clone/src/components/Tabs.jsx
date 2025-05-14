import { useState, useEffect } from 'react';
import './Tabs.css';
import LoginPage from '../pages/LoginPage';
import { fetchPosts, fetchEvents } from '../api/api';

const PAGE_SIZE = 2; // Number of items to load per scroll

const Tabs = () => {
  const [active, setActive] = useState('Following');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [posts, setPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [postsLimit, setPostsLimit] = useState(PAGE_SIZE);
  const [eventsLimit, setEventsLimit] = useState(PAGE_SIZE);

  useEffect(() => {
    // Fetch posts and events from RESTful API
    fetchPosts()
      .then(data => setPosts(data.length ? data : [
        {
          id: 1,
          username: "Herabst🪬",
          avatar: "3.jpg",
          time: "21h ago",
          category: "Honkai: Star Rail",
          text: "HOLY Damn",
          images: ["1.jpg", "2.jpg"],
          views: "67k",
          comments: 119,
          likes: 1448
        },
        {
          id: 2,
          username: "Fritzqt✨",
          avatar: "5.jpg",
          time: "12h ago",
          category: "Genshin Impact",
          text: "Exploring the beauty of Teyvat!",
          images: ["4.jpg", "6.jpg"],
          views: "45k",
          comments: 89,
          likes: 1200
        }
      ]))
      .catch(() => setPosts([
        {
          id: 1,
          username: "Herabst🪬",
          avatar: "3.jpg",
          time: "21h ago",
          category: "Honkai: Star Rail",
          text: "HOLY Damn",
          images: ["1.jpg", "2.jpg"],
          views: "67k",
          comments: 119,
          likes: 1448
        },
        {
          id: 2,
          username: "Fritzqt✨",
          avatar: "5.jpg",
          time: "12h ago",
          category: "Genshin Impact",
          text: "Exploring the beauty of Teyvat!",
          images: ["4.jpg", "6.jpg"],
          views: "45k",
          comments: 89,
          likes: 1200
        }
      ]));

    fetchEvents()
      .then(data => setEvents(data.length ? data : [
        {
          id: 1,
          status: "in-progress",
          image: "Event 1.jpg",
          title: "Primogem Rewards: Participate in Xilonen and Venti's Topic Discussions",
          description: "Join the discussion to get guaranteed avatar frames and Primogems.",
          date: "2025/04/14 - 2025/04/26"
        },
        {
          id: 2,
          status: "in-progress",
          image: "Event 2.jpg",
          title: "Sprint Towards the Finish Line",
          description: "Take part in the Teyvat Sports Contest to win Primogems.",
          date: "2025/04/02 - 2025/04/20"
        },
        {
          id: 3,
          status: "in-progress",
          image: "Event 3.jpg",
          title: "Web Event: Roaming Through the Realm of Saurians",
          description: "Participate to earn Primogems and exclusive rewards.",
          date: "2025/03/25 - 2025/05/04"
        },
        {
          id: 4,
          status: "ended",
          image: "Event 4.jpg",
          title: "The Night Deepens as Stars Gather Around the Moon",
          description: "Listen to the \"Song of the Welkin Moon\" for a magical experience.",
          date: "2025/02/01 - 2025/02/15"
        }
      ]))
      .catch(() => setEvents([
        {
          id: 1,
          status: "in-progress",
          image: "Event 1.jpg",
          title: "Primogem Rewards: Participate in Xilonen and Venti's Topic Discussions",
          description: "Join the discussion to get guaranteed avatar frames and Primogems.",
          date: "2025/04/14 - 2025/04/26"
        },
        {
          id: 2,
          status: "in-progress",
          image: "Event 2.jpg",
          title: "Sprint Towards the Finish Line",
          description: "Take part in the Teyvat Sports Contest to win Primogems.",
          date: "2025/04/02 - 2025/04/20"
        },
        {
          id: 3,
          status: "in-progress",
          image: "Event 3.jpg",
          title: "Web Event: Roaming Through the Realm of Saurians",
          description: "Participate to earn Primogems and exclusive rewards.",
          date: "2025/03/25 - 2025/05/04"
        },
        {
          id: 4,
          status: "ended",
          image: "Event 4.jpg",
          title: "The Night Deepens as Stars Gather Around the Moon",
          description: "Listen to the \"Song of the Welkin Moon\" for a magical experience.",
          date: "2025/02/01 - 2025/02/15"
        }
      ]));
  }, []);

  // Reset limits when switching tabs
  useEffect(() => {
    setPostsLimit(PAGE_SIZE);
    setEventsLimit(PAGE_SIZE);
  }, [active]);

  // Infinite scroll handler (window-level, only one handler)
  useEffect(() => {
    const handleInfiniteScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100
      ) {
        if (active === 'Recommended' && postsLimit < posts.length) {
          setPostsLimit(lim => Math.min(lim + PAGE_SIZE, posts.length));
        }
        if (active === 'Events' && eventsLimit < events.length) {
          setEventsLimit(lim => Math.min(lim + PAGE_SIZE, events.length));
        }
      }
    };
    window.addEventListener('scroll', handleInfiniteScroll);
    return () => window.removeEventListener('scroll', handleInfiniteScroll);
  }, [active, postsLimit, eventsLimit, posts.length, events.length]);

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
      const visiblePosts = posts.slice(0, postsLimit);
      return (
        <div className="recommended-container">
          {visiblePosts.length === 0 ? (
            <div>No posts available.</div>
          ) : (
            visiblePosts.map((post, idx) => (
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
          {postsLimit < posts.length && (
            <div className="infinite-scroll-loader">Loading more...</div>
          )}
        </div>
      );
    } else if (active === 'Events') {
      const visibleEvents = events.slice(0, eventsLimit);
      return (
        <div className="events-container">
          {visibleEvents.length === 0 ? (
            <div>No events available.</div>
          ) : (
            visibleEvents.map((event, idx) => (
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
          {eventsLimit < events.length && (
            <div className="infinite-scroll-loader">Loading more...</div>
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