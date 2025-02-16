"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function Header() {
  const router = useRouter();

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <header className="w-full bg-white border-b">
      <div className="container mx-auto px-4 h-16 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-700">Sustav Praćenja Prisutnosti</h1>
        <Button variant="outline" onClick={handleLogout}>
          Odjava
        </Button>
      </div>
    </header>
  );
}