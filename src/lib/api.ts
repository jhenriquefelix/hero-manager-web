import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "https://localhost",
});

// Aceitar 204 como sucesso
api.defaults.validateStatus = (s) => (s >= 200 && s < 300) || s === 204;
