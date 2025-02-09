"use client"

import { useState } from "react"
import { useAuth } from "./AuthProvider"
import dynamic from "next/dynamic"
import { Button } from "./ui/button"

const QrReader = dynamic(() => import("react-qr-reader"), { ssr: false })

export default function QRScanner() {
  const { user } = useAuth()
  const [scanResult, setScanResult] = useState("")
  const [error, setError] = useState("")

  const handleScan = (data: string | null) => {
    if (data) {
      try {
        const parsedData = JSON.parse(data)
        setScanResult(JSON.stringify(parsedData, null, 2))
        // Redirect to the Vercel URL or localhost if it's not available
        window.location.href = parsedData.url || "http://localhost:3000"
      } catch (err) {
        setError("Invalid QR code data")
      }
    }
  }

  const handleError = (err: any) => {
    console.error(err)
    setError("Error scanning QR code")
  }

  return (
    <div className="min-h-screen bg-blue-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-blue-800">Scan QR Code</h1>
        <div className="space-y-6">
          <QrReader delay={300} onError={handleError} onScan={handleScan} style={{ width: "100%" }} />
          {error && (
            <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
              <p>{error}</p>
            </div>
          )}
          {scanResult && (
            <div className="mt-4 p-4 bg-blue-100 rounded-md">
              <h2 className="text-lg font-semibold text-blue-800">Scan Result:</h2>
              <pre className="text-blue-600 whitespace-pre-wrap">{scanResult}</pre>
              <Button
                onClick={() => window.location.reload()}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
              >
                Scan Another Code
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

