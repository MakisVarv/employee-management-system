import { jwtDecode } from 'jwt-decode';
import { createContext, useState } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('access_token');

    if (!token) return null;

    const decoded = jwtDecode(token);

    return {
      id: decoded.id,
      username: decoded.sub,
      role: decoded.role,
    };
  });

  const login = async (data) => {
    const res = await API.post('/login', data);

    console.log(res.data);
    localStorage.setItem('access_token', res.data.access_token);
    localStorage.setItem('refresh_token', res.data.refresh_token);
    const decoded = jwtDecode(res.data.access_token);

    setUser({
      id: decoded.id,
      username: decoded.sub,
      role: decoded.role,
    });
  };

  const register = async (data) => {
    await API.post('/register', data);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  console.log(user);

  return (
    <AuthContext.Provider value={{ login, register, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};
