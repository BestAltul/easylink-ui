import { createContext, useContext, useState, useEffect } from "react";
import React from "react";
const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // загружаем пользователя из localStorage при старте
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData)); // сохраняем
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user"); // удаляем
    localStorage.removeItem("jwt");
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
