import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../utils/base';

const AdminContext = createContext(null);

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      fetchAdmin(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchAdmin = async (token) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/admin/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAdmin(response.data);
    } catch (error) {
      console.error('Error fetching admin:', error);
      localStorage.removeItem('adminToken');
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  const adminLogin = (adminData) => {
    setAdmin(adminData);
  };

  const adminLogout = () => {
    localStorage.removeItem('adminToken');
    setAdmin(null);
  };

  return (
    <AdminContext.Provider value={{ 
      admin, 
      loading, 
      adminLogin, 
      adminLogout,
      isAuthenticated: !!admin 
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext); 