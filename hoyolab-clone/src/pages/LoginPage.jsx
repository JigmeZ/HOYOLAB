import React, { useState } from 'react';
import './LoginPage.css';

const LoginPage = ({ onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const isFilled = username.trim() !== '' && password.trim() !== '';

  return (
    <div className="login-modal-overlay">
      <div className="login-modal">
        <button className="login-close" onClick={onClose}>×</button>
        <div className="login-logo login-logo-large">HoYoverse</div>
        <div className="login-title">Account Log In</div>
        <form className="login-form">
          <input
            type="text"
            placeholder="Username/Email"
            className="login-input"
            autoComplete="username"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          <div className="login-password-wrapper">
            <input
              type="password"
              placeholder="Password"
              className="login-input"
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className={`login-btn-main${isFilled ? ' active' : ''}`}
            disabled={!isFilled}
          >
            Log In
          </button>
        </form>
        <div className="login-links">
          <a href="#" className="login-link">Having Problems?</a>
          <a href="#" className="login-link register">Register Now</a>
        </div>
        <div className="login-divider">
          <span>More Login Methods</span>
        </div>
        <div className="login-socials">
          <button className="login-social"><img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" /></button>
          <button className="login-social"><img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple" /></button>
          <button className="login-social"><img src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png" alt="Facebook" /></button>
          <button className="login-social"><img src="https://upload.wikimedia.org/wikipedia/commons/4/4f/Twitter-logo.svg" alt="X" /></button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
