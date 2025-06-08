import axios from "axios";

const API_BASE_URL = "http://localhost:4000/api"; // Changed to match backend

export const fetchPosts = async () => {
  const response = await axios.get(`${API_BASE_URL}/posts`);
  return response.data;
};

export const fetchEvents = async () => {
  const response = await axios.get(`${API_BASE_URL}/events`);
  return response.data;
};

export const pingBackend = async () => {
  const response = await axios.get(`${API_BASE_URL}/ping`);
  return response.data;
};

export const echoBackend = async (data) => {
  const response = await axios.post(`${API_BASE_URL}/echo`, data);
  return response.data;
};
