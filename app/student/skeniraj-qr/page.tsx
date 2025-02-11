import { QRScanner } from "@/components/qr-scanner"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ScanQRPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-600">Skeniraj QR Kod</h1>
        <Link href="/student">
          <Button variant="outline">Natrag</Button>
        </Link>
      </div>
      <QRScanner />
    </div>
  )
}

