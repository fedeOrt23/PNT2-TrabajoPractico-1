'use client'

import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useState, useEffect } from 'react'
import authService from '../services/authService';

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext) 


export default function AuthProvider({children}) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const router = useRouter()

  useEffect(() => {
    try {
      const userStorage = localStorage.getItem("user");
      const isAuthStorage = localStorage.getItem("isAuthenticated");

      if (userStorage) {
        setUser(JSON.parse(userStorage));
      }
      if (isAuthStorage === 'true') {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.log("Error loading auth from localStorage:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async(userData) => {
    setLoading(true);
    
    try {
      const result = await authService.login(userData.email, userData.password);
      
      if (result.success) {
        setUser(result.user)
        setIsAuthenticated(true)
        localStorage.setItem("user", JSON.stringify(result.user))
        localStorage.setItem("isAuthenticated", "true")
        router.push("/")
      }
      return result;

    } catch (error) {
      return { success: false, error: "Error de conexión" }
    } finally {
      setLoading(false);
    }
  }

  const register = async(userData) => {
    setLoading(true);
    
    try {
      const result = await authService.register(userData);
      
      if (result.success) {
        setUser(result.user)
        setIsAuthenticated(true)
        localStorage.setItem("user", JSON.stringify(result.user))
        localStorage.setItem("isAuthenticated", "true")
        router.push("/")
      }
      
      return result;
    } catch (error) {
      return { success: false, error: "Error al crear la cuenta" }
    } finally {
      setLoading(false);
    }
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem("user")
    localStorage.removeItem("isAuthenticated")
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{user, loading, login, register, logout, isAuthenticated}}>
        {children}
    </AuthContext.Provider>
  )
}