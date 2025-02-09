"use client"

import { useAuth } from "../../components/AuthProvider"
import Link from "next/link"
import { Button } from "../../components/ui/button"

export default function Dashboard() {
  const { user, logout } = useAuth()

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-800">Welcome, {user.name}</h1>
          <Button onClick={logout} className="bg-blue-600 hover:bg-blue-700 text-white">
            Logout
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {user.role === "professor" ? (
            <>
              <Link
                href="/dashboard/qr-generator"
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <h2 className="text-xl font-semibold mb-2 text-blue-700">Generate QR Code</h2>
                <p className="text-blue-600">Create a QR code for class attendance</p>
              </Link>
              <Link
                href="/dashboard/attendance"
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <h2 className="text-xl font-semibold mb-2 text-blue-700">View Attendance</h2>
                <p className="text-blue-600">Check student attendance records</p>
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/dashboard/qr-scanner"
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <h2 className="text-xl font-semibold mb-2 text-blue-700">Scan QR Code</h2>
                <p className="text-blue-600">Scan the QR code for class attendance</p>
              </Link>
              <Link
                href="/dashboard/attendance"
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <h2 className="text-xl font-semibold mb-2 text-blue-700">View My Attendance</h2>
                <p className="text-blue-600">Check your attendance records</p>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

