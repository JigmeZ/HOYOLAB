import React, { useState } from "react";
import "./LoginPage.css";
import { register } from "../api/auth";

const RegisterPage = ({ onClose, onSwitchToLogin }) => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isFilled = username && name && email && password && password2 && agreed;

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!username || !name || !email || !password || !password2) {
      setError("All fields are required");
      setSuccess("");
      alert("All fields are required");
      return;
    }
    if (password !== password2) {
      setError("Passwords do not match");
      setSuccess("");
      alert("Passwords do not match");
      return;
    }
    if (!agreed) {
      setError("You must agree to the terms");
      setSuccess("");
      alert("You must agree to the terms");
      return;
    }
    try {
      await register({
        username,
        name,
        email,
        password,
        confirmPassword: password2,
      });
      setSuccess("Register completed and user created");
      setError("");
      alert("Register completed and user created");
    } catch (err) {
      let message = "Registration failed";
      if (err.response && err.response.data && err.response.data.message) {
        message = err.response.data.message;
      }
      setError(message);
      setSuccess("");
      alert(message);
      console.error("Registration error:", err);
    }
  };

  return (
    <div className="login-modal-overlay">
      <div className="login-modal">
        <button className="login-close" onClick={onClose}>
          ×
        </button>
        <div className="login-logo login-logo-large">HOYOVERSE</div>
        <div className="login-title">Register</div>
        <form className="login-form" onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Username"
            className="login-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="text"
            placeholder="Name"
            className="login-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="login-input"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Enter password"
            className="login-input"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Please enter password again"
            className="login-input"
            autoComplete="new-password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
          />
          <label
            style={{
              fontSize: 13,
              color: "#aaa",
              marginTop: 8,
              display: "flex",
              alignItems: "flex-start",
              gap: 8,
            }}
          >
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              style={{ marginTop: 2 }}
            />
            <span>
              I have read and agree to the{" "}
              <a href="#" style={{ color: "#4e88ff" }}>
                Terms of Service
              </a>
              ,{" "}
              <a href="#" style={{ color: "#4e88ff" }}>
                Privacy Policy
              </a>
              ,{" "}
              <a href="#" style={{ color: "#4e88ff" }}>
                HoYoLAB Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" style={{ color: "#4e88ff" }}>
                HoYoLAB Privacy Policy
              </a>
            </span>
          </label>
          <button
            type="submit"
            className={`login-btn-main${isFilled ? " active" : ""}`}
            disabled={!isFilled}
            style={{ marginTop: 10 }}
          >
            Register
          </button>
        </form>
        <div
          style={{
            marginTop: 18,
            textAlign: "center",
            color: "#aaa",
            fontSize: 15,
          }}
        >
          Already have an account?{" "}
          <span
            className="login-link"
            style={{ cursor: "pointer", color: "#4e88ff" }}
            onClick={onSwitchToLogin}
          >
            Log In
          </span>
        </div>
        <div className="login-divider">
          <span>More Login Methods</span>
        </div>
        <div className="login-socials">
          <button className="login-social">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
              alt="Google"
            />
          </button>
          <button className="login-social">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
              alt="Apple"
            />
          </button>
          <button className="login-social">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png"
              alt="Facebook"
            />
          </button>
          <button className="login-social">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/4/4f/Twitter-logo.svg"
              alt="X"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
