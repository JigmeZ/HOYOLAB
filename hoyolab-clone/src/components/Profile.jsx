import React, { useEffect, useState } from "react";
import "./Profile.css";
import { fetchPosts } from "../api/api";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [followedUsers, setFollowedUsers] = useState(() => {
    const stored = localStorage.getItem("followedUsers");
    return stored ? JSON.parse(stored) : [];
  });
  const [profileUser, setProfileUser] = useState(null); // For viewing other profiles
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    setUser(stored ? JSON.parse(stored) : null);
    // Optionally: setProfileUser if viewing another user's profile
    // For now, assume profileUser === user
    setProfileUser(stored ? JSON.parse(stored) : null);
  }, []);

  useEffect(() => {
    if (!profileUser) return;
    fetchPosts().then((posts) => {
      const filtered = posts.filter((p) => p.username === profileUser.username);
      setUserPosts(filtered);
    });
  }, [profileUser]);

  // Follow/unfollow logic
  const handleFollow = () => {
    if (!user || !profileUser) return;
    setFollowedUsers((prev) => {
      const updated = prev.includes(profileUser.username)
        ? prev.filter((u) => u !== profileUser.username)
        : [...prev, profileUser.username];
      localStorage.setItem("followedUsers", JSON.stringify(updated));
      return updated;
    });
  };

  // Count followers (simulate: count how many users have this username in their followedUsers)
  // For demo, just show 0 or 1 if current user follows this profile
  const isFollowing =
    user && profileUser && followedUsers.includes(profileUser.username);

  if (!profileUser) {
    return (
      <div className="profile-page">
        <div className="profile-header">
          <h2>Not logged in</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page profile-modern">
      {/* Return Button */}
      <div
        style={{
          width: "100vw",
          display: "flex",
          alignItems: "center",
          padding: "24px 0 0 40px",
        }}
      >
        <button
          className="profile-edit-btn"
          style={{
            position: "static",
            marginRight: 16,
            padding: "8px 22px",
            fontSize: "1rem",
            borderRadius: "8px",
            background: "#4e88ff",
            color: "#fff",
            border: "none",
            fontWeight: 600,
            cursor: "pointer",
          }}
          onClick={() => navigate(-1)}
        >
          ← Return
        </button>
      </div>
      {/* Profile Info Row */}
      <div
        className="profile-main-info-row profile-main-info-large"
        style={{
          marginBottom: 0,
          maxWidth: "100vw",
          width: "100%",
          justifyContent: "center",
          background: "#23232e",
        }}
      >
        <div className="profile-avatar-frame">
          <img
            src={
              profileUser.avatar
                ? profileUser.avatar.startsWith("/uploads/")
                  ? `http://localhost:4000${profileUser.avatar}`
                  : profileUser.avatar
                : "/3.jpg"
            }
            alt="Profile Avatar"
            className="profile-avatar-modern"
          />
          <div className="profile-avatar-frame-border"></div>
        </div>
        <div className="profile-main-info" style={{ gap: 2 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <span
              className="profile-main-username"
              style={{ fontSize: "2.2rem" }}
            >
              {profileUser.username}
            </span>
            <span className="profile-main-level" style={{ fontSize: "1.1rem" }}>
              Lv.10
            </span>
            {/* Show follow/unfollow if not own profile */}
            {user && user.username !== profileUser.username && (
              <button
                className="profile-edit-btn"
                style={{
                  padding: "8px 22px",
                  marginLeft: 16,
                  background: isFollowing ? "#23232e" : "#4e88ff",
                  color: isFollowing ? "#4e88ff" : "#fff",
                  border: isFollowing ? "1px solid #4e88ff" : "none",
                  cursor: "pointer",
                }}
                onClick={handleFollow}
              >
                {isFollowing ? "Following" : "Follow"}
              </button>
            )}
          </div>
          <div
            style={{
              color: "#bfcfff",
              fontSize: "1.1rem",
              marginTop: 2,
            }}
          >
            {profileUser.bio || "Default signature given to everyone~"}
          </div>
          <div
            style={{
              display: "flex",
              gap: 32,
              marginTop: 18,
              fontWeight: 600,
              fontSize: "1.1rem",
            }}
          >
            <span>
              <span style={{ color: "#fff" }}>{userPosts.length}</span> Posts
            </span>
            <span>
              <span style={{ color: "#fff" }}>
                {user && user.username === profileUser.username
                  ? (JSON.parse(localStorage.getItem("followedUsers")) || [])
                      .length
                  : isFollowing
                  ? 1
                  : 0}
              </span>{" "}
              Following
            </span>
            <span>
              <span style={{ color: "#fff" }}>{isFollowing ? 1 : 0}</span>{" "}
              Followers
            </span>
            <span>
              <span style={{ color: "#fff" }}>0</span> Likes
            </span>
          </div>
        </div>
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          {user && user.username === profileUser.username && (
            <button
              className="profile-edit-btn"
              style={{ padding: "10px 28px" }}
            >
              Edit
            </button>
          )}
        </div>
      </div>
      {/* Tabs and Content */}
      <div
        className="profile-content-modern profile-content-large"
        style={{
          marginTop: 32,
          background: "#181a20",
          boxShadow: "none",
          borderRadius: 18,
          display: "flex",
          gap: 32,
          minHeight: 380,
          maxWidth: "100vw",
          width: "100%",
        }}
      >
        {/* Left: Posts/Comments/Favorites/Topics */}
        <div style={{ flex: 2, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              gap: 32,
              marginBottom: 18,
              borderBottom: "2px solid #23232e",
              paddingBottom: 8,
            }}
          >
            <span
              style={{
                color: "#4e88ff",
                fontWeight: 600,
                borderBottom: "2px solid #4e88ff",
                paddingBottom: 4,
                cursor: "pointer",
              }}
            >
              Posts
            </span>
            <span
              style={{
                color: "#aaa",
                fontWeight: 500,
                cursor: "not-allowed",
              }}
            >
              Comments
            </span>
            <span
              style={{
                color: "#aaa",
                fontWeight: 500,
                cursor: "not-allowed",
              }}
            >
              Favorites
            </span>
            <span
              style={{
                color: "#aaa",
                fontWeight: 500,
                cursor: "not-allowed",
              }}
            >
              Topics
            </span>
          </div>
          {userPosts.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                marginTop: 48,
                color: "#aaa",
              }}
            >
              <div style={{ fontSize: 18 }}>You haven't posted anything~</div>
            </div>
          ) : (
            <div className="profile-posts">
              {userPosts.map((post) => (
                <div className="profile-post-card" key={post.id}>
                  <div className="profile-post-header">
                    <span className="profile-post-category">
                      {post.category}
                    </span>
                    <span className="profile-post-date">
                      {new Date(post.time).toLocaleString()}
                    </span>
                  </div>
                  <div className="profile-post-content">{post.text}</div>
                  {/* No post images or video */}
                  <div className="profile-post-meta">
                    <span>Likes: {post.likes}</span>
                    <span>Comments: {post.comments}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Right: Sidebar */}
        <div
          style={{
            flex: 1,
            minWidth: 260,
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          <div
            style={{
              background: "#23232e",
              borderRadius: 12,
              padding: "22px 18px",
              marginBottom: 8,
            }}
          >
            <div
              style={{
                fontWeight: 600,
                fontSize: 18,
                marginBottom: 10,
              }}
            >
              Creator LAB
            </div>
            <button
              style={{
                width: "100%",
                background: "#23234a",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "10px 0",
                fontWeight: 600,
                fontSize: 16,
                marginBottom: 6,
                cursor: "pointer",
              }}
            >
              Enter
            </button>
          </div>
          <div
            style={{
              background: "#23232e",
              borderRadius: 12,
              padding: "18px 18px",
              marginBottom: 8,
            }}
          >
            <div
              style={{
                fontWeight: 600,
                fontSize: 17,
                marginBottom: 8,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span>Achievement Center</span>
            </div>
          </div>
          <div
            style={{
              background: "#23232e",
              borderRadius: 12,
              padding: "18px 18px",
              marginBottom: 8,
            }}
          >
            <div
              style={{
                fontWeight: 600,
                fontSize: 17,
                marginBottom: 8,
              }}
            >
              Profile Information
            </div>
            <div
              style={{
                color: "#bfcfff",
                fontSize: 15,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span role="img" aria-label="id">
                🆔
              </span>
              Account ID: {user.id || "105230983"}
            </div>
          </div>
          <div
            style={{
              background: "#23232e",
              borderRadius: 12,
              padding: "18px 18px",
            }}
          >
            <div
              style={{
                fontWeight: 600,
                fontSize: 17,
                marginBottom: 8,
              }}
            >
              Genshin Impact
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span style={{ color: "#fff" }}>{user.username}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
