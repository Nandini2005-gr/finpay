import { createContext, useContext, useState, useEffect } from "react"
import API from "../api"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem("token"))

  const login = async (email, password) => {
    const res = await API.post("/auth/login", { email, password })
    localStorage.setItem("token", res.data.access_token)
    setToken(res.data.access_token)
  }

  const register = async (name, email, password) => {
    await API.post("/auth/register", { name, email, password })
    await login(email, password)
  }

  const logout = () => {
    localStorage.removeItem("token")
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}