import { createContext, useState, useContext } from 'react'; // 1. මෙතනට useContext එකතු කරා

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 2. මෙන්න මේ කෑල්ල අලුතින්ම යටින් එකතු කරා 
export const useAuth = () => {
  return useContext(AuthContext);
};