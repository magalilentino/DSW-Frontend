// URL base de la API del backend. Se configura con la variable VITE_API_URL del archivo .env
// (ver .env.example). Si no está definida, se usa el backend local.
export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";
