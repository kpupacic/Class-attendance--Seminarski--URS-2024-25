"use client"

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { QrCode, ClipboardList } from "lucide-react"
import Link from "next/link"

function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

export function StudentDashboard() {
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const name = getCookie("authenticatedUserName");
    setUserName(name);
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-blue-500">Dobrodošli,  {userName ? userName : ""}</h1>

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

