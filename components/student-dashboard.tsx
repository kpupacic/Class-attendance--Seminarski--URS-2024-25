"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { QrCode, ClipboardList } from "lucide-react"
import Link from "next/link"

export function StudentDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-blue-600">Dobrodošli, Student Johnson</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <Link href="/student/skeniraj-qr">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                Skeniraj QR Kod
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Skenirajte QR kod za evidenciju prisutnosti na nastavi</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/student/moja-prisutnost">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5" />
                Moja Prisutnost
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Pregledajte svoju evidenciju prisutnosti</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}

