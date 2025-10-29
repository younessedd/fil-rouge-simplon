import React, { createContext, useState } from "react";

// إنشاء الكونتكست
export const AdminAuthContext = createContext();

// بروفايدر لتغليف التطبيق
export const AdminAuthProvider = ({ children }) => {
  // استرجاع بيانات المدير من localStorage وتحويلها من JSON لكائن
  const adminInfo = JSON.parse(localStorage.getItem("adminInfo") || "null");
  const [user, setUser] = useState(adminInfo);

  // دالة تسجيل الدخول
  const login = (userData) => {
    localStorage.setItem("adminInfo", JSON.stringify(userData));
    setUser(userData);
  };

  // دالة تسجيل الخروج
  const logout = () => {
    localStorage.removeItem("adminInfo");
    setUser(null);
  };

  return (
    <AdminAuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
