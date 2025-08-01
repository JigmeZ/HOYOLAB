import "./Navbar.css";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaSearch, FaPen, FaBell, FaUserCircle } from "react-icons/fa";
import profileImage from "../assets/profile.jpg";
import postImage from "../assets/post.jpg";
import imageUpload from "../assets/image.jpg";
import videoUpload from "../assets/video.jpg";
import LoginPage from "../pages/LoginPage";

function Navbar({ onLogoClick }) {
  const [placeholder, setPlaceholder] = useState("Check in");
  const [placeholderClass, setPlaceholderClass] = useState(
    "placeholder-fade-in"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showTriangleDropdown, setShowTriangleDropdown] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => !!localStorage.getItem("token")
  );
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [userProfilePic, setUserProfilePic] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const fileInputRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderClass("placeholder-fade-out");
      setTimeout(() => {
        setPlaceholder((prev) =>
          prev === "Check in" ? "Trending" : "Check in"
        );
        setPlaceholderClass("placeholder-fade-in");
      }, 500);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Listen for login/logout changes from Tabs (storage event)
  useEffect(() => {
    const onStorage = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
      if (token) {
        const stored = localStorage.getItem("user");
        setUser(stored ? JSON.parse(stored) : null);
      } else {
        setUser(null);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const toggleTriangleDropdown = () => {
    setShowTriangleDropdown((prev) => {
      if (!prev) setShowSearchDropdown(false);
      return !prev;
    });
  };

  const handleSearchFocus = () => {
    setShowSearchDropdown(true);
    setShowTriangleDropdown(false);
  };

  const handleSearchBlur = () => {
    setTimeout(() => setShowSearchDropdown(false), 200);
  };

  const handleSearchIconClick = () => {
    setSearchQuery("");
    setShowSearchDropdown(false);
    navigate("/search");
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      setSearchQuery("");
      setShowSearchDropdown(false);
      navigate("/search");
    }
  };

  // Simulate login for demo: set isLoggedIn to true when login modal closes
  const handleLoginClose = () => {
    setShowLogin(false);
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    if (token) {
      const stored = localStorage.getItem("user");
      setUser(stored ? JSON.parse(stored) : null);
    }
    window.dispatchEvent(new Event("storage"));
  };

  // Handle profile picture upload
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setUserProfilePic(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  // Only allow login modal if not logged in
  const handleProfileIconClick = () => {
    if (!isLoggedIn) {
      setShowLogin(true);
    } else {
      navigate("/profile");
    }
  };

  // Require login before post/image/video actions
  const requireLogin = () => {
    if (!isLoggedIn) {
      setShowLogin(true);
      return false;
    }
    return true;
  };

  // Handlers for post/image/video
  const handlePostClick = () => {
    if (!requireLogin()) return;
    // ...your post logic here...
  };
  const handleImageClick = () => {
    if (!requireLogin()) return;
    // ...your image logic here...
  };
  const handleVideoClick = () => {
    if (!requireLogin()) return;
    // ...your video logic here...
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    setUserProfilePic(null);
    setShowLogin(true);
    setShowLogoutConfirm(false);
    window.dispatchEvent(new Event("storage"));
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div
          className="navbar-logo"
          style={{ cursor: "pointer" }}
          onClick={onLogoClick}
        >
          HoYoLAB
        </div>
        <ul className="navbar-links">
          <li>
            <Link to="/" className={location.pathname === "/" ? "active" : ""}>
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/interest-group"
              className={
                location.pathname === "/interest-group" ? "active" : ""
              }
            >
              Interest Group
            </Link>
          </li>
        </ul>
      </div>
      <div className="navbar-right">
        <div className="search-bar">
          <div className="user-icon" onClick={toggleTriangleDropdown}>
            🔵
          </div>
          <span
            className={`dropdown-icon ${showTriangleDropdown ? "rotated" : ""}`}
            onClick={toggleTriangleDropdown}
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
            onKeyDown={handleSearchKeyDown}
          />
          <span className="search-icon" onClick={handleSearchIconClick}>
            <FaSearch />
          </span>

          {showSearchDropdown && (
            <div className="search-dropdown show">
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
                  <img src="path/to/genshin-icon.png" alt="GenshinImpact" />{" "}
                  GenshinImpact
                </li>
                <li>
                  <img src="path/to/honkai-icon.png" alt="Honkai:StarRail" />{" "}
                  Honkai:StarRail
                </li>
                <li>
                  <img src="path/to/zenless-icon.png" alt="ZenlessZoneZero" />{" "}
                  ZenlessZoneZero
                </li>
                <li>
                  <img src="path/to/hoyolab-icon.png" alt="HoYoLAB" /> HoYoLAB
                </li>
                <li>
                  <img
                    src="path/to/honkai3rd-icon.png"
                    alt="Honkai Impact 3rd"
                  />{" "}
                  Honkai Impact 3rd
                </li>
                <li>
                  <img src="path/to/tears-icon.png" alt="TearsOfThemis" />{" "}
                  TearsOfThemis
                </li>
              </ul>
            </div>
          )}
        </div>

        <div className="post-icon">
          <FaPen />
          <div className="post-dropdown">
            <ul>
              <li onClick={handlePostClick}>
                <img
                  src={postImage}
                  alt="Post"
                  className="dropdown-item-image"
                />
                <span>Post</span>
                <span className="dropdown-arrow">›</span>
              </li>
              <li onClick={handleImageClick}>
                <img
                  src={imageUpload}
                  alt="Image"
                  className="dropdown-item-image"
                />
                <span>Image</span>
                <span className="dropdown-arrow">›</span>
              </li>
              <li onClick={handleVideoClick}>
                <img
                  src={videoUpload}
                  alt="Video"
                  className="dropdown-item-image"
                />
                <span>Video</span>
                <span className="dropdown-arrow">›</span>
              </li>
            </ul>
            <div className="dropdown-footer">
              <span>📄 Drafts (0)</span>
            </div>
          </div>
        </div>

        <div className="notification-icon">
          <FaBell />
        </div>
        <div className="profile-icon" onClick={handleProfileIconClick}>
          {!isLoggedIn ? (
            <FaUserCircle size={40} color="#888" />
          ) : (
            <img src={userProfilePic || profileImage} alt="Profile" />
          )}
          {isLoggedIn && (
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleProfilePicChange}
            />
          )}
        </div>
        {/* Only show login modal if not logged in */}
        {!isLoggedIn && showLogin && <LoginPage onClose={handleLoginClose} />}
        {/* Show username and logout button ONLY after login */}
        {isLoggedIn && user && (
          <>
            <span style={{ marginLeft: 12, fontWeight: 600, color: "#4e88ff" }}>
              {user.username}
            </span>
            <button
              style={{
                marginLeft: 16,
                background: "#23232e",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "6px 16px",
                fontWeight: 500,
                cursor: "pointer",
              }}
              onClick={handleLogout}
            >
              Log out
            </button>
          </>
        )}
      </div>
      {/* Pop-out logout confirmation box */}
      {showLogoutConfirm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.4)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#23232e",
              borderRadius: 12,
              padding: "32px 40px",
              minWidth: 320,
              textAlign: "center",
              boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
              color: "#fff",
            }}
          >
            <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 18 }}>
              Log out?
            </div>
            <div style={{ color: "#aaa", marginBottom: 24 }}>
              Are you sure you want to log out?
            </div>
            <div style={{ display: "flex", gap: 18, justifyContent: "center" }}>
              <button
                style={{
                  background: "#4e88ff",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "8px 28px",
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: "pointer",
                }}
                onClick={confirmLogout}
              >
                Yes, Log out
              </button>
              <button
                style={{
                  background: "#23232e",
                  color: "#fff",
                  border: "1px solid #4e88ff",
                  borderRadius: 8,
                  padding: "8px 28px",
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: "pointer",
                }}
                onClick={cancelLogout}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
