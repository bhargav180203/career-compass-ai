import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const API_URL = `${process.env.REACT_APP_API_URL}/auth`;

  // Set axios default header
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      loadUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  // Load user data
  const loadUser = async () => {
    try {
      const response = await axios.get(`${API_URL}/me`);
      setUser(response.data.user);
    } catch (error) {
      console.error('Load user error:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Register
  const register = async (userData) => {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  };

  // Verify Email
  const verifyEmail = async (email, otp) => {
    const response = await axios.post(`${API_URL}/verify-email`, { email, otp });
    const { token, user } = response.data;
    
    localStorage.setItem('token', token);
    setToken(token);
    setUser(user);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    return response.data;
  };

  // Resend OTP
  const resendOTP = async (email) => {
    const response = await axios.post(`${API_URL}/resend-otp`, { email });
    return response.data;
  };

  // Login
  const login = async (email, password) => {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    const { token, user } = response.data;
    
    localStorage.setItem('token', token);
    setToken(token);
    setUser(user);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    return response.data;
  };

  // Google Login
  const googleLogin = async (credential) => {
    const response = await axios.post(`${API_URL}/google`, { credential });
    const { token, user } = response.data;
    
    localStorage.setItem('token', token);
    setToken(token);
    setUser(user);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    return response.data;
  };

  // Forgot Password
  const forgotPassword = async (email) => {
    const response = await axios.post(`${API_URL}/forgot-password`, { email });
    return response.data;
  };

  // Reset Password
  const resetPassword = async (email, otp, newPassword) => {
    const response = await axios.post(`${API_URL}/reset-password`, { 
      email, 
      otp, 
      newPassword 
    });
    return response.data;
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const value = {
    user,
    token,
    loading,
    register,
    verifyEmail,
    resendOTP,
    login,
    googleLogin,
    forgotPassword,
    resetPassword,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};