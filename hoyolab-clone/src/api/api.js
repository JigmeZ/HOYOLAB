import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api'; // Ensure this matches your backend URL

export const fetchPosts = async () => {
  const response = await axios.get(`${API_BASE_URL}/posts`);
  return response.data;
};

export const fetchEvents = async () => {
  const response = await axios.get(`${API_BASE_URL}/events`);
  return response.data;
};
