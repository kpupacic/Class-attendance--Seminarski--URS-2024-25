"use client"

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, Users } from "lucide-react";
import Link from "next/link";

function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

export function ProfessorDashboard() {
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const name = getCookie("authenticatedUserName");
    setUserName(name);
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-blue-500">
        Dobrodošli, {userName ? userName : ""}
      </h1>
      <div className="grid md:grid-cols-2 gap-6">
        <Link href="/profesor/generiraj-qr">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                Generiraj QR Kod
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Kreirajte QR kod za evidenciju prisutnosti na nastavi</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/profesor/prisutnost">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Pregled Prisutnosti
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Pregledajte prisutnost studenata na nastavi</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}