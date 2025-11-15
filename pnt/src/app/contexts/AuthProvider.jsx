'use client'

import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useState, useEffect } from 'react'

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
      console.log("userStorage: ", userStorage);
      console.log("isAuthStorage: ", isAuthStorage);
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
    console.log("login userData: ", userData);
    setLoading(true);
    
    try {
      console.log("userData: ", userData);
      
      const resp = await fetch("https://690160fdff8d792314bd3f83.mockapi.io/api/v1/users")
      const data = await resp.json();

      console.log("data: ", data);
      
      const userFind = data.find(u => u.email === userData.email && u.password === userData.password)

      console.log("user: ", userFind);
      
      if(userFind){
        setUser(userFind)
        setIsAuthenticated(true)
        localStorage.setItem("user", JSON.stringify(userFind))
        localStorage.setItem("isAuthenticated", "true")
        router.push("/")
        return { success: true, user: userFind }
      } else {
        setIsAuthenticated(false)
        return { success: false, error: "Usuario o contraseña incorrectos" }
      }
    } catch (error) {
      console.log("Error en login:", error);
      return { success: false, error: "Error inesperado. Intenta nuevamente." }
    } finally {
      setLoading(false);
    }
  }

  const register = async(userData) => {
    setLoading(true);
    
    try {
      // 1. Verificar si el email ya existe
      const resp = await fetch("https://690160fdff8d792314bd3f83.mockapi.io/api/v1/users")
      const users = await resp.json();
      
      const emailExists = users.find(u => u.email === userData.email);
      
      if (emailExists) {
        return { success: false, error: "Este email ya está registrado" }
      }

      const username = `${userData.name.toLowerCase()}.${userData.lastname.toLowerCase()}`;

      // 2. Crear nuevo usuario en MockAPI
      const createResp = await fetch("https://690160fdff8d792314bd3f83.mockapi.io/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: username,
          name: userData.name,
          lastname: userData.lastname,
          email: userData.email,
          password: userData.password,
        })
      });

      if (!createResp.ok) {
        throw new Error("Error al crear usuario");
      }

      const newUser = await createResp.json();

      // 3. Auto-login después del registro
      setUser(newUser)
      setIsAuthenticated(true)
      localStorage.setItem("user", JSON.stringify(newUser))
      localStorage.setItem("isAuthenticated", "true")

      router.push("/")
      return { success: true, user: newUser }

    } catch (error) {
      console.error("Error en registro:", error);
      return { success: false, error: "Error al crear la cuenta. Intenta nuevamente." }
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