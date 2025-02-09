"use client"

import { useState } from "react"
import { QrReader } from "react-qr-reader"

export default function QRScanner() {
  const [scanResult, setScanResult] = useState("")

  const handleScan = (result: any) => {
    if (result) {
      setScanResult(result?.text)
      // TODO: Send scan result to server to record presence
    }
  }

  const handleError = (error: any) => {
    console.error(error)
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl font-semibold mb-5">Scan QR Code</h1>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <QrReader
                  onResult={handleScan}
                  constraints={{ facingMode: "environment" }}
                  containerStyle={{ width: "100%" }}
                />
                {scanResult && (
                  <div className="mt-4">
                    <h2 className="text-lg font-semibold">Scan Result:</h2>
                    <p className="text-sm">{scanResult}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

