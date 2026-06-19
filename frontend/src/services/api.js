import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  timeout: 20000,
});

export const getMovies = async () => {
  const response = await api.get("/movies");
  return response.data;
};

export const getRecommendations = async (movie, limit = 10) => {
  const response = await api.post("/recommend", { movie, limit });
  return response.data.recommendations;
};

export const getTrendingMovies = async (limit = 8) => {
  const response = await api.get(`/trending?limit=${limit}`);
  return response.data.movies;
};

export default api;
