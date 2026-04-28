import { createContext, useState } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (data) => {
    const res = await API.post('/login', data);

    localStorage.setItem('access_token', res.data.access_token);
    localStorage.setItem('refresh_token', res.data.refresh_token);

    setUser({ username: data.username });
  };

  const register = async (data) => {
    await API.post('/register', data);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ login, register, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};
