"use client"

import { useState, useRef, useCallback } from "react"
import { QrReader } from "react-qr-reader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import debounce from "lodash.debounce"

// Function to get the value of a cookie by name
function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null
  return null
}

export function QRScanner() {
  const [scanning, setScanning] = useState(true)
  const lastResultRef = useRef<string | null>(null)

  const handleScan = useCallback(
    debounce(async (result: string | null) => {
      if (result && result !== lastResultRef.current) {
        lastResultRef.current = result
        setScanning(false)
        toast.success("Prisutnost zabilježena!")
        console.log(result)

        // Separate the groupId and date before the year "2025"
        const yearIndex = result.indexOf("2025")
        if (yearIndex === -1) {
          toast.error("Invalid QR code format")
          return
        }

        const groupId = result.substring(11, yearIndex - 1) // Skip "attendance-" prefix
        const date = result.substring(yearIndex)

        console.log("groupId:", groupId)
        console.log("date:", date)

        // Get the studentId from the cookie
        const studentId = getCookie("authenticatedUserId")
        if (!studentId) {
          toast.error("Student ID not found in cookies")
          return
        }

        // Call your server-side API
        try {
          const res = await fetch("/api/attendance", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              studentId,
              groupId,
              date,
            }),
          })
          if (!res.ok) {
            throw new Error("Failed to update attendance")
          }
        } catch (error) {
          console.error(error)
          toast.error("Greška: nije moguće ažurirati prisutnost")
        }
      }
    }, 500),
    []
  )

  const handleError = (error: unknown) => {
    console.error(error)
    toast.error("Greška pri skeniranju")
  }

  const stopVideoStream = () => {
    const videoElement = document.querySelector("video")
    if (videoElement) {
      const stream = videoElement.srcObject as MediaStream
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }

  const handleScanAgain = () => {
    stopVideoStream()
    setTimeout(() => {
      lastResultRef.current = null
      setScanning(true)
    }, 200)
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
              onResult={(res) => {
                if (res) {
                  try {
                    handleScan(res.getText())
                  } catch (error) {
                    handleError(error)
                  }
                }
              }}
              className="w-full"
            />
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-green-600 font-medium mb-4">QR kod uspješno skeniran!</p>
            <button onClick={handleScanAgain} className="text-blue-600 underline">
              Skeniraj ponovno
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}