"use client"

import { useState } from "react"
import { FilterForm } from "./filter-form"
import { QRCodeSVG } from "qrcode.react"
import { Card, CardContent } from "@/components/ui/card"

export function QRGeneratorForm() {
  const [qrValue, setQrValue] = useState("")

  const handleSubmit = (filters: { type: string; subject: string; group: string }) => {
    // Generate a unique QR code value based on the filters and current timestamp
    const timestamp = new Date().getTime()
    setQrValue(`attendance-${filters.type}-${filters.subject}-${filters.group}-${timestamp}`)
  }

  return (
    <div className="space-y-6">
      <FilterForm title="Generiranje QR koda" onSubmit={handleSubmit} buttonText="Generiraj QR kod" />

      {qrValue && (
        <Card className="w-full max-w-md mx-auto">
          <CardContent className="flex justify-center pt-6">
            <QRCodeSVG value={qrValue} size={200} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}

