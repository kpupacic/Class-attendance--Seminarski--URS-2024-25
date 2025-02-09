"use client"

import { useState } from "react"
import { useAuth } from "../components/AuthProvider"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"

export default function Home() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      await login(email, password)
    } catch (err) {
      setError("Invalid credentials")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-blue-800 text-center">Student Presence Tracker</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit">Log In</Button>
        </form>
        <div className="mt-4 text-sm text-gray-600">
          <p>For testing, use these credentials:</p>
          <ul className="list-disc list-inside">
            <li>Professor: email: professor@example.com, password: prof123</li>
            <li>Student: email: student@example.com, password: stud123</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

