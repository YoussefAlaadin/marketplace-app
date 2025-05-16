import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // ✅ الإصلاح هنا

// Create the UserContext
export const UserContext = createContext();

// Provider to wrap the application
export const UserProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const roles = localStorage.getItem("roles");

    if (token) {
      try {
        const decoded = jwtDecode(token); // ✅ استخدام بعد التعديل
        setUserInfo({
          token,
          roles: roles ? roles.split(",") : [],
          userId: decoded.uid,
          email: decoded.email,
        });
      } catch (error) {
        console.error("Failed to decode token:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("roles");
        localStorage.removeItem("userId");
      }
    }
  }, []);

  const login = (userData) => {
    const { token, roles } = userData;
    localStorage.setItem("token", token);
    localStorage.setItem("roles", roles.join(","));
    const decoded = jwtDecode(token); // ✅ استخدام بعد التعديل
    setUserInfo({
      token,
      roles,
      userId: decoded.uid,
      email: decoded.email,
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("roles");
    localStorage.removeItem("userId");
    setUserInfo(null);
  };

  return (
    <UserContext.Provider value={{ userInfo, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
