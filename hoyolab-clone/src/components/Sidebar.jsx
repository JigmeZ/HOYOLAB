import React, { useState, useCallback } from "react";
import "./Sidebar.css";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import toolboxImg from "../assets/images/toolbox.png";
import checkinImg from "../assets/images/checkin.png";
import welkinImg from "../assets/images/welkin.png";
import getImg from "../assets/images/get.png";
import widgetsImg from "../assets/images/widgets.png";
import hoyowikiImg from "../assets/images/hoyowiki.png";
import mapImg from "../assets/images/map.png";
import chronicleImg from "../assets/images/chronicle.png";
import sketchImg from "../assets/images/sketch.png";
import postIcon from "../assets/icons/post.png";
import imageIcon from "../assets/icons/imagess.png";
import videoIcon from "../assets/icons/video.png";
import draftIcon from "../assets/icons/draft.png";
import user1Img from "../assets/images/user1.png";
import user2Img from "../assets/images/user2.png";
import LoginPage from "../pages/LoginPage";

const MAX_SIZE = 10 * 1024 * 1024; // 10MB

const Sidebar = () => {
  const genshinItems = [
    { name: "Toolbox", img: toolboxImg },
    { name: "Check-In", img: checkinImg },
    { name: "Song of the Welkin Moon", img: welkinImg },
    { name: "Raise Saurians and Get...", img: getImg },
    { name: "Widget", img: widgetsImg },
    { name: "HoYoWiki", img: hoyowikiImg },
    { name: "Teyvat Interactive Map", img: mapImg },
    { name: "Battle Chronicle", img: chronicleImg },
    { name: "HoYoSketch", img: sketchImg },
  ];

  const [followedUsers, setFollowedUsers] = useState({});

  const handleFollowClick = (userName) => {
    setFollowedUsers((prev) => ({
      ...prev,
      [userName]: !prev[userName],
    }));
  };

  // Add authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => !!localStorage.getItem("token")
  );
  const [showLogin, setShowLogin] = useState(false);

  React.useEffect(() => {
    const checkLogin = () => setIsLoggedIn(!!localStorage.getItem("token"));
    window.addEventListener("storage", checkLogin);
    return () => window.removeEventListener("storage", checkLogin);
  }, []);

  const requireLogin = () => {
    if (!isLoggedIn) {
      setShowLogin(true);
      return false;
    }
    return true;
  };

  const [uploadType, setUploadType] = useState(null); // "post" | "image" | "video"
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState("");
  const [showDropzone, setShowDropzone] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles, rejectedFiles) => {
      setUploadError("");
      setUploadProgress(0);
      if (rejectedFiles.length > 0) {
        setUploadError("Invalid file type or size.");
        return;
      }
      const file = acceptedFiles[0];
      if (!file) return;
      // Validate file type
      if (
        (uploadType === "image" && !file.type.startsWith("image/")) ||
        (uploadType === "video" && !file.type.startsWith("video/")) ||
        (uploadType === "post" &&
          !(file.type.startsWith("image/") || file.type.startsWith("video/")))
      ) {
        setUploadError("Invalid file type for this upload.");
        return;
      }
      // Validate file size
      if (file.size > MAX_SIZE) {
        setUploadError("File too large (max 10MB).");
        return;
      }
      // Upload
      const formData = new FormData();
      formData.append("file", file);
      let endpoint = "/api/upload/post";
      if (uploadType === "image") endpoint = "/api/upload/image";
      if (uploadType === "video") endpoint = "/api/upload/video";
      try {
        const res = await axios.post(
          `http://localhost:4000${endpoint}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: (progressEvent) => {
              setUploadProgress(
                Math.round((progressEvent.loaded * 100) / progressEvent.total)
              );
            },
          }
        );
        // Save post to backend so all users see it
        const user = JSON.parse(localStorage.getItem("user"));
        const postRes = await axios.post("http://localhost:4000/api/posts", {
          username: user?.username || "Anonymous",
          avatar: user?.avatar || "3.jpg",
          type: uploadType,
          url: res.data.url,
          text: "New upload!",
        });
        window.dispatchEvent(
          new CustomEvent("new-upload", { detail: postRes.data })
        );
        setShowDropzone(false);
        setUploadProgress(0);
        setUploadError("");
        alert("Upload successful!");
      } catch (err) {
        setUploadError("Upload failed");
      }
    },
    [uploadType]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: MAX_SIZE,
    multiple: false,
    accept:
      uploadType === "image"
        ? { "image/*": [] }
        : uploadType === "video"
        ? { "video/*": [] }
        : { "image/*": [], "video/*": [] },
  });

  // Show dropzone modal
  const openDropzone = (type) => {
    if (!requireLogin()) return;
    setUploadType(type);
    setShowDropzone(true);
    setUploadProgress(0);
    setUploadError("");
  };

  // Update handlers to require login
  const handlePostClick = () => {
    if (!requireLogin()) return;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*,video/*";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) handleFileUpload(file, "post");
    };
    input.click();
  };

  const handleImageClick = () => {
    if (!requireLogin()) return;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) handleFileUpload(file, "image");
    };
    input.click();
  };

  const handleVideoClick = () => {
    if (!requireLogin()) return;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "video/*";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) handleFileUpload(file, "video");
    };
    input.click();
  };

  const handleDraftClick = async (e) => {
    e.preventDefault();
    if (!requireLogin()) return;
    try {
      await fetch("/api/draft", { method: "GET" });
      console.log("Draft endpoint called");
    } catch (err) {
      console.error("Failed to call draft endpoint", err);
    }
  };

  return (
    <>
      <div className="sidebar">
        <div className="container">
          <div className="post-header">
            <h2>Post now~</h2> {/* Header */}
            <a href="#" className="drafts-link" onClick={handleDraftClick}>
              <img src={draftIcon} alt="Drafts" className="drafts-icon" />{" "}
              Drafts (0)
            </a>{" "}
            {/* Drafts button */}
          </div>
          <div className="post-options">
            <button onClick={() => openDropzone("post")}>
              <img src={postIcon} alt="Post" className="button-icon" />
              <span className="button-label">Post</span>
            </button>
            <button onClick={() => openDropzone("image")}>
              <img src={imageIcon} alt="Image" className="button-icon" />
              <span className="button-label">Image</span>
            </button>
            <button onClick={() => openDropzone("video")}>
              <img src={videoIcon} alt="Video" className="button-icon" />
              <span className="button-label">Video</span>
            </button>
          </div>
        </div>
        <div className="container">
          <div className="genshin-header">
            <h3>Genshin Impact</h3> {/* Header */}
            <div className="genshin-controls">
              <span className="page-indicator">1</span>
              <span className="page-indicator">2</span>
            </div>
          </div>
          <div className="genshin-impact">
            <div className="grid-container">
              {genshinItems.map((item, index) => (
                <div key={index} className="grid-item">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="grid-item-image"
                  />
                  <div className="grid-item-text">{item.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="container recommended-users">
          <h3>Recommended Users</h3>
          <div className="user-card">
            <div className="user-info">
              <img src={user1Img} alt="User 1" className="user-icon" />
              <div>
                <div className="user-name">Zombs</div>
                <div className="user-followers">
                  New record of total followers 130k
                </div>
              </div>
            </div>
            <button
              className="follow-button"
              onClick={() => handleFollowClick("Pun_Rii")}
            >
              {followedUsers["Pun_Rii"] ? "Added" : "+"}
            </button>
          </div>
          <div className="user-card">
            <div className="user-info">
              <img src={user2Img} alt="User 2" className="user-icon" />
              <div>
                <div className="user-name">Fritzqt</div>
                <div className="user-followers">
                  New record of total followers 41k
                </div>
              </div>
            </div>
            <button
              className="follow-button"
              onClick={() => handleFollowClick("Junebu")}
            >
              {followedUsers["Junebu"] ? "Added" : "+"}
            </button>
          </div>
        </div>
      </div>
      {showDropzone && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.7)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setShowDropzone(false)}
        >
          <div
            {...getRootProps()}
            style={{
              background: "#23232e",
              borderRadius: 16,
              padding: 40,
              minWidth: 340,
              minHeight: 180,
              textAlign: "center",
              border: "2px dashed #4e88ff",
              color: "#fff",
              position: "relative",
              zIndex: 10000,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the file here ...</p>
            ) : (
              <p>
                Drag & drop a {uploadType} file here, or click to select file
                <br />
                <span style={{ fontSize: 13, color: "#aaa" }}>
                  (Max size: 10MB)
                </span>
              </p>
            )}
            {uploadProgress > 0 && (
              <div
                style={{
                  marginTop: 16,
                  width: "100%",
                  background: "#444",
                  borderRadius: 8,
                  height: 12,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${uploadProgress}%`,
                    background: "#4e88ff",
                    height: "100%",
                    transition: "width 0.3s",
                  }}
                />
              </div>
            )}
            {uploadError && (
              <div style={{ color: "#ff6b6b", marginTop: 12 }}>
                {uploadError}
              </div>
            )}
            <button
              style={{
                marginTop: 24,
                background: "#23232e",
                color: "#fff",
                border: "1px solid #4e88ff",
                borderRadius: 8,
                padding: "8px 32px",
                fontWeight: 600,
                fontSize: 16,
                cursor: "pointer",
              }}
              onClick={() => setShowDropzone(false)}
              type="button"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {showLogin && (
        <LoginPage
          onClose={() => {
            setShowLogin(false);
            setIsLoggedIn(!!localStorage.getItem("token"));
          }}
        />
      )}
    </>
  );
};

export default Sidebar;
