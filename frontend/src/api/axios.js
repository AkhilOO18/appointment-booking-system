import axios from "axios";

// All backend calls go through here. Change baseURL if your backend runs elsewhere.
const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Attach the saved JWT (if any) to every outgoing request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
