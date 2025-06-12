import axios from "axios";

// Ensure all authentication requests use the correct backend API port.
const API_BASE = "http://localhost:4000/api/auth";

export const register = async (data) => {
  console.log("Register payload:", data); // Debug: log data being sent
  const res = await axios.post(`${API_BASE}/register`, data);
  return res.data;
};

export const login = async (data) => {
  console.log("Login payload:", data); // Debug: log data being sent
  const res = await axios.post(`${API_BASE}/login`, data);
  return res.data;
};
