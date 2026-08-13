import axios from "axios";
import { API_BASE_URL } from "../../constants";
import { store } from "../features/store";
import { logout, rehydrate } from "../features/AuthSlice";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
}

export function rehydrateAuthFromStorage() {
  const token = localStorage.getItem("token");
  if (token) {
    setAuthToken(token);
    store.dispatch(rehydrate(token));
  }
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      setAuthToken(null);
      store.dispatch(logout());
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login?message=unauthorized";
      }
    }
    return Promise.reject(error);
  }
);
