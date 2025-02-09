import "./globals.css"
import { Inter } from "next/font/google"
import { AuthProvider } from "../components/AuthProvider"
import type React from "react" // Added import for React

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Student Presence Tracker",
  description: "Track student attendance using QR codes",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}

