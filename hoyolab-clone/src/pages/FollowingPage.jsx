import React, { useEffect, useState } from "react";
// ...existing imports...

const FollowingPage = () => {
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch followed users here (replace with your API call)
    // Example: fetch("/api/users/following").then(...)
    setFollowing([]); // Simulate no followed users
    setLoading(false);
  }, []);

  return (
    <div
      className="following-container"
      style={{ color: "#fff", background: "#181a20", minHeight: "100vh" }}
    >
      <div
        className="tabs"
        style={{ display: "flex", gap: 24, borderBottom: "1px solid #222" }}
      >
        <div className="tab active">Following</div>
        <div className="tab">Recommended</div>
        <div className="tab">Events</div>
      </div>
      <div style={{ padding: "32px 0", textAlign: "center" }}>
        <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 16 }}>
          Recommended Users
        </div>
        {loading ? (
          <div>Loading...</div>
        ) : following.length === 0 ? (
          <div>
            <img
              src="https://upload-os-bbs.mihoyo.com/upload/2021/11/19/1f6b6b2e7e6e7b1e7e7e7e7e7e7e7e7e.png"
              alt="Welcome"
              style={{ width: 80, marginBottom: 16 }}
            />
            <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 8 }}>
              Welcome to HoYoLAB
            </div>
            <div style={{ color: "#aaa", fontSize: 16 }}>
              Follow people that you may be interested in and have fun!
            </div>
          </div>
        ) : (
          // Render followed users here
          <div>{/* ...user list... */}</div>
        )}
      </div>
    </div>
  );
};

export default FollowingPage;
