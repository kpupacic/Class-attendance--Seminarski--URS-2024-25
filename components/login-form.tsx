"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { authenticate } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const user = authenticate(email, password)

    if (user) {
      if (user.role === "professor") {
        router.push("/profesor")
      } else {
        router.push("/student")
      }
    } else {
      toast.error("Neispravni podaci za prijavu")
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl text-center text-blue-600">Sustav Praćenja Prisutnosti Studenata</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Lozinka"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full">
            Prijava
          </Button>
        </form>

        <div className="mt-6 text-sm text-muted-foreground">
          <p className="mb-2">Za testiranje, koristite ove podatke:</p>
          <ul className="space-y-1">
            <li>• Profesor: email: professor@example.com, lozinka: prof123</li>
            <li>• Student: email: student@example.com, lozinka: stud123</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

