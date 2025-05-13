import React from 'react';
import './ProfilePage.css';

const ProfilePage = () => {
  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-banner">
          <div className="profile-info">
            <img
              src="/path/to/profile-avatar.jpg"
              alt="Profile Avatar"
              className="profile-avatar"
            />
            <div className="profile-details">
              <h1 className="profile-name">Fritzqt</h1>
              <p className="profile-signature">Default signature given to everyone~</p>
              <div className="profile-stats">
                <span>0 Posts</span> / <span>0 Following</span> / <span>0 Followers</span> / <span>1 Likes</span>
              </div>
            </div>
          </div>
          <button className="edit-button">Edit ▼</button>
        </div>
      </div>
      <div className="profile-content">
        <div className="tabs">
          <button className="tab active">Posts</button>
          <button className="tab">Comments</button>
          <button className="tab">Favorites</button>
          <button className="tab">Topics</button>
        </div>
        <div className="tab-content">
          <div className="empty-state">
            <img src="/path/to/empty-state-icon.png" alt="Empty State" />
            <p>You haven't posted anything~</p>
          </div>
        </div>
        <div className="sidebar">
          <div className="creator-lab">
            <h3>Creator LAB</h3>
            <p>0 Post Views</p>
            <p>0 Post Likes</p>
            <button className="enter-button">Enter</button>
          </div>
          <div className="achievement-center">
            <h3>Achievement Center</h3>
            <div className="achievements">
              <img src="/path/to/achievement1.png" alt="Achievement 1" />
              <img src="/path/to/achievement2.png" alt="Achievement 2" />
              <img src="/path/to/achievement3.png" alt="Achievement 3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
