import { useState, useEffect } from "react";
import "./Tabs.css";
import LoginPage from "../pages/LoginPage";
import { fetchPosts, fetchEvents } from "../api/api";
import axios from "axios";
import { FaRegHeart, FaHeart, FaRegCommentDots } from "react-icons/fa";

const PAGE_SIZE = 2; // Number of items to load per scroll

const Tabs = () => {
  const [active, setActive] = useState("Following");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [posts, setPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [postsLimit, setPostsLimit] = useState(PAGE_SIZE);
  const [eventsLimit, setEventsLimit] = useState(PAGE_SIZE);
  const [likedPosts, setLikedPosts] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [showCommentBox, setShowCommentBox] = useState({});
  const [comments, setComments] = useState({}); // { postId: [ { user, text } ] }
  const [userLikes, setUserLikes] = useState({}); // { postId: { [userId]: true/false } }

  useEffect(() => {
    fetchPosts()
      .then((data) => setPosts(data))
      .catch(() => setPosts([]));

    fetchEvents()
      .then((data) => setEvents(data))
      .catch(() => setEvents([]));
  }, []);

  useEffect(() => {
    setPostsLimit(PAGE_SIZE);
    setEventsLimit(PAGE_SIZE);
  }, [active]);

  useEffect(() => {
    const handleInfiniteScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 100
      ) {
        if (active === "Recommended" && postsLimit < posts.length) {
          setPostsLimit((lim) => Math.min(lim + PAGE_SIZE, posts.length));
        }
        if (active === "Events" && eventsLimit < events.length) {
          setEventsLimit((lim) => Math.min(lim + PAGE_SIZE, events.length));
        }
      }
    };
    window.addEventListener("scroll", handleInfiniteScroll);
    return () => window.removeEventListener("scroll", handleInfiniteScroll);
  }, [active, postsLimit, eventsLimit, posts.length, events.length]);

  // Fetch all comments for all posts (simulate global comments)
  useEffect(() => {
    const fetchAllComments = async () => {
      const newComments = {};
      for (const post of posts) {
        // If you have a backend endpoint, use axios.get(`/api/posts/${post.id}/comments`)
        // Here, just keep local state for demo
        if (comments[post.id]) {
          newComments[post.id] = comments[post.id];
        }
      }
      setComments(newComments);
    };
    if (posts.length > 0) fetchAllComments();
    // eslint-disable-next-line
  }, [posts]);

  const getUserId = () => {
    // Use a unique identifier for the user (e.g., from localStorage or backend)
    // Fallback to "guest" if not logged in
    return JSON.parse(localStorage.getItem("user"))?.id || "guest";
  };

  // Like button handler (per-user like/unlike, frontend only)
  const handleLike = async (postId) => {
    const userId = getUserId();
    const alreadyLiked = likedPosts[`${postId}_${userId}`];

    try {
      // Optionally send userId to backend for real tracking
      await axios.post(`/api/posts/${postId}/like`, {
        unlike: alreadyLiked,
        userId,
      });

      setLikedPosts((prev) => ({
        ...prev,
        [`${postId}_${userId}`]: !alreadyLiked,
      }));

      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? {
                ...p,
                likes: alreadyLiked ? Math.max(0, p.likes - 1) : p.likes + 1,
              }
            : p
        )
      );
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to like post. Make sure your backend is running and the post exists."
      );
    }
  };

  // Show/hide comment box
  const handleCommentIcon = (postId) => {
    setShowCommentBox((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  // Handle comment input change
  const handleCommentInput = (postId, value) => {
    setCommentInputs((prev) => ({
      ...prev,
      [postId]: value,
    }));
  };

  // Submit comment (calls backend and updates comments for all users)
  const handleCommentSubmit = async (postId) => {
    const text = (commentInputs[postId] || "").trim();
    if (!text) return;
    const user =
      JSON.parse(localStorage.getItem("user"))?.username || "Anonymous";
    try {
      const res = await axios.post(`/api/posts/${postId}/comment`, {
        text,
        user,
      });
      // Add the comment to all users' view (simulate global comments)
      setComments((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] || []), { user, text }],
      }));
      setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
      setShowCommentBox((prev) => ({ ...prev, [postId]: false }));
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, comments: res.data.comments } : p
        )
      );
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to comment. Make sure your backend is running and the post exists."
      );
    }
  };

  const tabs = ["Following", "Recommended", "Events"];
  const dropdownOptions = [
    "Genshin Impact",
    "Honkai: Star Rail",
    "Zenless Zone Zero",
    "HoYoLAB",
    "Honkai Impact 3rd",
    "Tears of Themis",
  ];

  const renderContent = () => {
    if (active === "Following") {
      return (
        <div className="tab-content following-content">
          <img src="7.jpg" alt="Empty Box" className="empty-box-image" />
          <p className="following-text">
            Log in to discover more interesting content
          </p>
          <button className="login-btn" onClick={() => setShowLogin(true)}>
            Log in
          </button>
          {showLogin && <LoginPage onClose={() => setShowLogin(false)} />}
        </div>
      );
    } else if (active === "Recommended") {
      const visiblePosts = posts.slice(0, postsLimit);
      return (
        <div className="recommended-container">
          {visiblePosts.length === 0 ? (
            <div>No posts available.</div>
          ) : (
            visiblePosts.map((post, idx) => (
              <div className="recommended-card" key={post.id || idx}>
                <div className="user-info">
                  <img
                    src={post.avatar || "3.jpg"}
                    alt="User Avatar"
                    className="user-avatar"
                  />
                  <div className="user-details">
                    <span className="user-name">{post.username}</span>
                    <span className="user-meta">
                      {post.time} • {post.category}
                    </span>
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
                      <img
                        src={
                          img.startsWith("http")
                            ? img
                            : `http://localhost:4000${
                                img.startsWith("/") ? "" : "/"
                              }${img}`
                        }
                        alt={`Post Image ${i + 1}`}
                        className="post-image"
                        key={i}
                        style={{
                          maxWidth: 400,
                          borderRadius: 8,
                          marginBottom: 8,
                        }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = "none";
                        }}
                      />
                    ))}
                  </div>
                )}
                {post.video && (
                  <video
                    src={
                      post.video.startsWith("http")
                        ? post.video
                        : `http://localhost:4000${
                            post.video.startsWith("/") ? "" : "/"
                          }${post.video}`
                    }
                    controls
                    className="post-image"
                    style={{
                      width: "100%",
                      maxWidth: 400,
                      borderRadius: 8,
                      marginTop: 8,
                    }}
                  />
                )}
                <div className="post-meta">
                  <div className="views">
                    <span className="icon">👁️</span> {post.views}
                  </div>
                  <div className="actions">
                    <div
                      className="comments-btn"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                      }}
                      onClick={() => handleCommentIcon(post.id)}
                    >
                      <FaRegCommentDots style={{ marginRight: 4 }} />
                      {post.comments || 0}
                    </div>
                    <div
                      className={`like-btn${
                        likedPosts[`${post.id}_${getUserId()}`] ? " liked" : ""
                      }`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                        marginLeft: 12,
                        opacity: 1,
                        transition: "color 0.2s",
                        color: likedPosts[`${post.id}_${getUserId()}`]
                          ? "#e74c3c"
                          : undefined,
                      }}
                      onClick={() => handleLike(post.id)}
                    >
                      {likedPosts[`${post.id}_${getUserId()}`] ? (
                        <FaHeart
                          color="#e74c3c"
                          style={{ marginRight: 4, transition: "color 0.2s" }}
                        />
                      ) : (
                        <FaRegHeart
                          style={{ marginRight: 4, transition: "color 0.2s" }}
                        />
                      )}
                      {post.likes}
                    </div>
                    <div className="emotes">
                      <span className="emote">👍</span>
                      <span className="emote">🎉</span>
                    </div>
                  </div>
                </div>
                {/* Comment input box */}
                {showCommentBox[post.id] && (
                  <div
                    style={{
                      marginTop: 12,
                      background: "#23232e",
                      borderRadius: 8,
                      padding: "24px 32px",
                      maxWidth: 650,
                      minWidth: 350,
                      minHeight: 50,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                      fontSize: 16,
                      color: "#fff",
                      display: "flex",
                      flexDirection: "column",
                      gap: 18,
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 600,
                        color: "#4e88ff",
                        marginBottom: 8,
                      }}
                    >
                      Comments
                    </div>
                    {/* Show all comments for this post */}
                    <div
                      style={{
                        maxHeight: 140,
                        overflowY: "auto",
                        marginBottom: 14,
                        width: "100%",
                      }}
                    >
                      {comments[post.id] && comments[post.id].length > 0 ? (
                        comments[post.id].map((c, i) => (
                          <div
                            key={i}
                            style={{
                              marginBottom: 18,
                              borderBottom: "1px solid #333",
                              paddingBottom: 10,
                              wordBreak: "break-word",
                              fontSize: 17,
                            }}
                          >
                            <span style={{ fontWeight: 600, color: "#4e88ff" }}>
                              {c.user}:
                            </span>{" "}
                            <span>{c.text}</span>
                          </div>
                        ))
                      ) : (
                        <div style={{ color: "#aaa" }}>No comments yet.</div>
                      )}
                    </div>
                    {/* Comment input box */}
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <input
                        type="text"
                        value={commentInputs[post.id] || ""}
                        onChange={(e) =>
                          handleCommentInput(post.id, e.target.value)
                        }
                        placeholder="Write a comment..."
                        style={{
                          flex: 1,
                          padding: 10,
                          borderRadius: 6,
                          border: "1px solid #ccc",
                          fontSize: 16,
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleCommentSubmit(post.id);
                        }}
                      />
                      <button
                        style={{
                          padding: "10px 22px",
                          borderRadius: 6,
                          background: "#4e88ff",
                          color: "#fff",
                          border: "none",
                          fontWeight: 600,
                          fontSize: 16,
                          cursor: "pointer",
                        }}
                        onClick={() => handleCommentSubmit(post.id)}
                      >
                        Post
                      </button>
                    </div>
                  </div>
                )}
                {/* Show comments below post for all users */}
                {comments[post.id] && comments[post.id].length > 0 && (
                  <div
                    style={{
                      marginTop: 10,
                      background: "#23232e",
                      borderRadius: 8,
                      padding: "24px 32px",
                      maxWidth: 650,
                      minWidth: 350,
                      minHeight: 50,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                      fontSize: 16,
                      color: "#fff",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 600,
                        color: "#4e88ff",
                        marginBottom: 8,
                      }}
                    >
                      Comments
                    </div>
                    {comments[post.id].map((c, i) => (
                      <div
                        key={i}
                        style={{
                          marginBottom: 12,
                          borderBottom: "1px solid #333",
                          paddingBottom: 8,
                          wordBreak: "break-word",
                        }}
                      >
                        <span style={{ fontWeight: 600, color: "#4e88ff" }}>
                          {c.user}:
                        </span>{" "}
                        <span>{c.text}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
          {postsLimit < posts.length && (
            <div className="infinite-scroll-loader">Loading more...</div>
          )}
        </div>
      );
    } else if (active === "Events") {
      const visibleEvents = events.slice(0, eventsLimit);
      return (
        <div className="events-container">
          {visibleEvents.length === 0 ? (
            <div>No events available.</div>
          ) : (
            visibleEvents.map((event, idx) => (
              <div className="event-card" key={event.id || idx}>
                <span
                  className={`event-status ${
                    event.status === "ended" ? "ended" : "in-progress"
                  }`}
                >
                  {event.status === "ended" ? "Already Ended" : "In Progress"}
                </span>
                <img
                  src={event.image}
                  alt={event.title}
                  className="event-image"
                />
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
    <div className={`tabs-container ${isScrolled ? "scrolled" : ""}`}>
      {active === "Events" && (
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

      <div className="tabs-nav" style={{ position: "relative" }}>
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`tab-button ${active === tab ? "active" : ""}`}
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
