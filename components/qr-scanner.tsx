"use client"

import { useState } from "react"
import { QrReader } from "react-qr-reader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export function QRScanner() {
  const [scanning, setScanning] = useState(true)

  const handleScan = (result: string | null) => {
    if (result) {
      setScanning(false)
      toast.success("Prisutnost zabilježena!")
      console.log("QR Code scanned:", result)
    }
  }

  const handleError = (error: Error) => {
    console.error(error)
    toast.error("Greška pri skeniranju")
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Skeniraj QR Kod</CardTitle>
      </CardHeader>
      <CardContent>
        {scanning ? (
          <div className="overflow-hidden rounded-lg">
            <QrReader
              constraints={{ facingMode: "environment" }}
              onResult={(result) => {
                if (result) {
                  handleScan(result.getText())
                }
              }}
              onError={handleError}
              className="w-full"
            />
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-green-600 font-medium mb-4">QR kod uspješno skeniran!</p>
            <button onClick={() => setScanning(true)} className="text-blue-600 underline">
              Skeniraj ponovno
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

