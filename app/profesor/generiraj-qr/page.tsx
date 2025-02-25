import { QRGeneratorForm } from "@/components/qr-generator-form"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function GenerateQRPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">Generiranje QR Koda</h1>
        <Link href="/profesor">
          <Button variant="outline">Povratak</Button>
        </Link>
      </div>
      <QRGeneratorForm />
    </div>
  )
}

