import axios from "axios";

export const register = async (data) => {
  const res = await axios.post("http://localhost:5173/api/auth/register", data);
  return res.data;
};

export const login = async (data) => {
  const res = await axios.post("http://localhost:5173/api/auth/login", data);
  return res.data;
};
