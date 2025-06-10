import axios from "axios";

// Ensure all authentication requests use port 3000 for the backend API.
const API_BASE = "http://localhost:3000/api/auth";

export const register = async (data) => {
  const res = await axios.post(`${API_BASE}/register`, data);
  return res.data;
};

export const login = async (data) => {
  const res = await axios.post(`${API_BASE}/login`, data);
  return res.data;
};
