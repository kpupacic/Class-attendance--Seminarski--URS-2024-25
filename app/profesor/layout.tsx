import { Header } from "@/components/header"
import type React from "react"

export default function ProfessorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      <Header />
      <main className="container mx-auto p-4">{children}</main>
    </div>
  )
}

