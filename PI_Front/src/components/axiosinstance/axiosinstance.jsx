// axiosInstance.js

import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/", // L'URL de base de votre API
  withCredentials: true, // Inclure les cookies avec chaque requête (si nécessaire)
});

// Ajoutez un interceppeur pour ajouter le token d'authentification aux requêtes sortantes
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
