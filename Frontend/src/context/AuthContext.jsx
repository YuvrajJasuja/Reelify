import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { API_BASE_URL } from "../api.js";

// Axios request interceptor to automatically attach Authorization header Bearer token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Check auth state on mount/refresh
  useEffect(() => {
    const checkAuth = async () => {
      if (window.location.pathname === "/auth-success") {
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(`${API_BASE_URL}/api/user/me`, {
          withCredentials: true,
        });
        if (response.data && response.data.user) {
          setUser(response.data.user);
          localStorage.setItem("user", JSON.stringify(response.data.user));
        } else {
          setUser(null);
          localStorage.removeItem("user");
          localStorage.removeItem("token");
        }
      } catch (error) {
        console.error("Session check failed or unauthenticated:", error.message);
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    if (token) {
      localStorage.setItem("token", token);
    }
  };

  const loginWithToken = async (token) => {
    localStorage.setItem("token", token);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/user/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data && response.data.user) {
        setUser(response.data.user);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        return response.data.user;
      } else {
        throw new Error("No user profile returned");
      }
    } catch (error) {
      console.error("Login with token failed:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axios.get(`${API_BASE_URL}/api/user/logout`, {
        withCredentials: true,
      });
    } catch (error) {
      console.error("Logout API failed:", error);
    } finally {
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
