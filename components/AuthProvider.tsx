"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

type User = {
  id: string
  name: string
  role: "professor" | "student"
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Fake user credentials
const FAKE_USERS = {
  professor: { email: "professor@example.com", password: "prof123", name: "Professor Smith", id: "1" },
  student: { email: "student@example.com", password: "stud123", name: "Student Johnson", id: "2" },
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in (e.g., from localStorage)
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = async (email: string, password: string) => {
    // Check against our fake user credentials
    if (email === FAKE_USERS.professor.email && password === FAKE_USERS.professor.password) {
      const user = { id: FAKE_USERS.professor.id, name: FAKE_USERS.professor.name, role: "professor" as const }
      setUser(user)
      localStorage.setItem("user", JSON.stringify(user))
      router.push("/dashboard")
    } else if (email === FAKE_USERS.student.email && password === FAKE_USERS.student.password) {
      const user = { id: FAKE_USERS.student.id, name: FAKE_USERS.student.name, role: "student" as const }
      setUser(user)
      localStorage.setItem("user", JSON.stringify(user))
      router.push("/dashboard")
    } else {
      throw new Error("Invalid credentials")
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/")
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

