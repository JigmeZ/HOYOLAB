import { useState, useEffect, useRef } from "react";
import "./Tabs.css";
import LoginPage from "../pages/LoginPage";
import { fetchPosts, fetchEvents } from "../api/api";
import axios from "axios";
import { FaRegHeart, FaHeart, FaRegCommentDots } from "react-icons/fa";

const PAGE_SIZE = 2;

const Tabs = () => {
  // State
  const [active, setActive] = useState("Recommended");
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
  const [comments, setComments] = useState({});
  const [userLikes, setUserLikes] = useState({});
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [followedUsers, setFollowedUsers] = useState(() => {
    // Persist followed users in localStorage
    const stored = localStorage.getItem("followedUsers");
    return stored ? JSON.parse(stored) : [];
  });

  // Refs
  const lastPostRef = useRef(null);
  const [containerMinHeight, setContainerMinHeight] = useState(300);

  // Fetch posts and events on mount
  useEffect(() => {
    fetchPosts()
      .then(setPosts)
      .catch(() => setPosts([]));
    fetchEvents()
      .then(setEvents)
      .catch(() => setEvents([]));
  }, []);

  // Reset limits on tab change
  useEffect(() => {
    setPostsLimit(PAGE_SIZE);
    setEventsLimit(PAGE_SIZE);
  }, [active]);

  // Infinite scroll
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
        if (comments[post.id]) {
          newComments[post.id] = comments[post.id];
        }
      }
      setComments(newComments);
    };
    if (posts.length > 0) fetchAllComments();
    // eslint-disable-next-line
  }, [posts]);

  // Listen for login/logout changes from Navbar (storage event)
  useEffect(() => {
    const onStorage = () => {
      const token = localStorage.getItem("token");
      if (token) {
        const stored = localStorage.getItem("user");
        setUser(stored ? JSON.parse(stored) : null);
      } else {
        setUser(null);
      }
      setShowLogin(false);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Dynamically set minHeight of tabs-container based on last post's position
  useEffect(() => {
    if (active === "Recommended" && lastPostRef.current) {
      const rect = lastPostRef.current.getBoundingClientRect();
      const containerRect = document
        .querySelector(".tabs-container")
        ?.getBoundingClientRect();
      let minHeight = 300;
      if (containerRect) {
        minHeight = rect.bottom - containerRect.top + 60;
      }
      setContainerMinHeight(minHeight);
    } else {
      setContainerMinHeight(300);
    }
  }, [posts.length, postsLimit, active]);

  // Listen for new-upload event to update container height
  useEffect(() => {
    const handleNewUpload = () => {
      setTimeout(() => {
        if (active === "Recommended" && lastPostRef.current) {
          const rect = lastPostRef.current.getBoundingClientRect();
          const containerRect = document
            .querySelector(".tabs-container")
            ?.getBoundingClientRect();
          let minHeight = 300;
          if (containerRect) {
            minHeight = rect.bottom - containerRect.top + 60;
          }
          setContainerMinHeight(minHeight);
        }
      }, 300);
    };
    window.addEventListener("new-upload", handleNewUpload);
    return () => window.removeEventListener("new-upload", handleNewUpload);
  }, [active]);

  // Update localStorage when followedUsers changes
  useEffect(() => {
    localStorage.setItem("followedUsers", JSON.stringify(followedUsers));
  }, [followedUsers]);

  // Helpers
  const getUserId = () => {
    return JSON.parse(localStorage.getItem("user"))?.id || "guest";
  };

  // Like button handler
  const handleLike = async (postId) => {
    const userId = getUserId();
    const alreadyLiked = likedPosts[`${postId}_${userId}`];
    try {
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

  // Comment logic
  const handleCommentIcon = (postId) => {
    setShowCommentBox((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };
  const handleCommentInput = (postId, value) => {
    setCommentInputs((prev) => ({
      ...prev,
      [postId]: value,
    }));
  };
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

  // Follow/unfollow logic
  const handleFollow = (username) => {
    setFollowedUsers((prev) =>
      prev.includes(username)
        ? prev.filter((u) => u !== username)
        : [...prev, username]
    );
  };

  // Tab and dropdown options
  const tabs = ["Followed", "Recommended", "Events"];
  const dropdownOptions = [
    "Genshin Impact",
    "Honkai: Star Rail",
    "Zenless Zone Zero",
    "HoYoLAB",
    "Honkai Impact 3rd",
    "Tears of Themis",
  ];

  // Render
  const renderContent = () => {
    if (active === "Followed") {
      // Show posts from followed users
      const followedPosts = posts.filter((p) =>
        followedUsers.includes(p.username)
      );
      return (
        <div className="tab-content following-content">
          <img src="7.jpg" alt="Empty Box" className="empty-box-image" />
          {user ? (
            <>
              <p
                className="following-text"
                style={{ fontWeight: 600, fontSize: 18 }}
              >
                Welcome, {user.username}
              </p>
              <div style={{ marginTop: 24 }}>
                <div style={{ fontWeight: 600, marginBottom: 10 }}>
                  You are following:
                </div>
                {followedUsers.length === 0 ? (
                  <div style={{ color: "#aaa" }}>
                    You are not following anyone yet.
                  </div>
                ) : (
                  <ul style={{ listStyle: "none", padding: 0 }}>
                    {followedUsers.map((uname) => (
                      <li key={uname} style={{ marginBottom: 8 }}>
                        <span style={{ color: "#4e88ff", fontWeight: 600 }}>
                          {uname}
                        </span>
                        <button
                          style={{
                            marginLeft: 16,
                            background: "#23232e",
                            color: "#fff",
                            border: "none",
                            borderRadius: 8,
                            padding: "4px 14px",
                            fontWeight: 500,
                            cursor: "pointer",
                          }}
                          onClick={() => handleFollow(uname)}
                        >
                          Unfollow
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div style={{ marginTop: 32 }}>
                <div style={{ fontWeight: 600, marginBottom: 10 }}>
                  Posts from users you follow:
                </div>
                {followedPosts.length === 0 ? (
                  <div style={{ color: "#aaa" }}>
                    No posts from followed users.
                  </div>
                ) : (
                  <div className="recommended-container">
                    {followedPosts.map((post, idx) => (
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
                            {user && post.username !== user.username && (
                              <button
                                className="follow-button"
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  background:
                                    "linear-gradient(90deg,#181a20 60%,#23232e 100%)",
                                  border: "2px solid #4e88ff",
                                  borderRadius: "999px",
                                  padding: "0",
                                  width: 70,
                                  height: 32,
                                  position: "relative",
                                  overflow: "hidden",
                                  cursor: "pointer",
                                  boxShadow: "0 2px 8px rgba(78,136,255,0.10)",
                                  transition: "border 0.18s, background 0.18s",
                                }}
                                onClick={() => handleFollow(post.username)}
                              >
                                <span
                                  style={{
                                    position: "absolute",
                                    left: 0,
                                    top: 0,
                                    width: "100%",
                                    height: "100%",
                                    background:
                                      "linear-gradient(90deg,#23232e 40%,#4e88ff 100%)",
                                    borderRadius: "999px",
                                    zIndex: 1,
                                    opacity: 0.7,
                                  }}
                                ></span>
                                <span
                                  style={{
                                    position: "relative",
                                    zIndex: 2,
                                    color: "#fff",
                                    fontWeight: 700,
                                    fontSize: 13,
                                    letterSpacing: 0.5,
                                  }}
                                >
                                  {followedUsers.includes(post.username)
                                    ? "Following"
                                    : "Follow"}
                                </span>
                              </button>
                            )}
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
                                likedPosts[`${post.id}_${getUserId()}`]
                                  ? " liked"
                                  : ""
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
                                  style={{
                                    marginRight: 4,
                                    transition: "color 0.2s",
                                  }}
                                />
                              ) : (
                                <FaRegHeart
                                  style={{
                                    marginRight: 4,
                                    transition: "color 0.2s",
                                  }}
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
                            <div
                              style={{
                                maxHeight: 140,
                                overflowY: "auto",
                                marginBottom: 14,
                                width: "100%",
                              }}
                            >
                              {comments[post.id] &&
                              comments[post.id].length > 0 ? (
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
                                    <span
                                      style={{
                                        fontWeight: 600,
                                        color: "#4e88ff",
                                      }}
                                    >
                                      {c.user}:
                                    </span>{" "}
                                    <span>{c.text}</span>
                                  </div>
                                ))
                              ) : (
                                <div style={{ color: "#aaa" }}>
                                  No comments yet.
                                </div>
                              )}
                            </div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                              }}
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
                                  if (e.key === "Enter")
                                    handleCommentSubmit(post.id);
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
                                <span
                                  style={{ fontWeight: 600, color: "#4e88ff" }}
                                >
                                  {c.user}:
                                </span>{" "}
                                <span>{c.text}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <p className="following-text">
                Log in to discover more interesting content
              </p>
              <button className="login-btn" onClick={() => setShowLogin(true)}>
                Log in
              </button>
              {showLogin && (
                <LoginPage
                  onClose={() => {
                    setShowLogin(false);
                    window.dispatchEvent(new Event("storage"));
                  }}
                />
              )}
            </>
          )}
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
              <div
                className="recommended-card"
                key={post.id || idx}
                ref={idx === visiblePosts.length - 1 ? lastPostRef : null}
              >
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
                    {user && post.username !== user.username && (
                      <button
                        className="follow-button"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background:
                            "linear-gradient(90deg,#181a20 60%,#23232e 100%)",
                          border: "2px solid #4e88ff",
                          borderRadius: "999px",
                          padding: "0",
                          width: 70,
                          height: 32,
                          position: "relative",
                          overflow: "hidden",
                          cursor: "pointer",
                          boxShadow: "0 2px 8px rgba(78,136,255,0.10)",
                          transition: "border 0.18s, background 0.18s",
                        }}
                        onClick={() => handleFollow(post.username)}
                      >
                        <span
                          style={{
                            position: "absolute",
                            left: 0,
                            top: 0,
                            width: "100%",
                            height: "100%",
                            background:
                              "linear-gradient(90deg,#23232e 40%,#4e88ff 100%)",
                            borderRadius: "999px",
                            zIndex: 1,
                            opacity: 0.7,
                          }}
                        ></span>
                        <span
                          style={{
                            position: "relative",
                            zIndex: 2,
                            color: "#fff",
                            fontWeight: 700,
                            fontSize: 13,
                            letterSpacing: 0.5,
                          }}
                        >
                          {followedUsers.includes(post.username)
                            ? "Following"
                            : "Follow"}
                        </span>
                      </button>
                    )}
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
    <div
      className={`tabs-container ${isScrolled ? "scrolled" : ""}`}
      style={
        active === "Recommended"
          ? { minHeight: containerMinHeight }
          : { minHeight: 300 }
      }
    >
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
