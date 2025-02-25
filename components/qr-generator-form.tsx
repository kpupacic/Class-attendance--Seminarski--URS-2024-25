"use client"

import { useState, useEffect } from "react"
import { FilterForm } from "./filter-form"
import { QRCodeSVG } from "qrcode.react"
import { Card, CardContent } from "@/components/ui/card"

function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null
  return null
}

async function getProfessorData(professorId: string) {
  const response = await fetch(`/api/professors/${professorId}`)
  if (!response.ok) {
    throw new Error("Failed to fetch professor data")
  }
  return response.json()
}

export function QRGeneratorForm() {
  const [qrValue, setQrValue] = useState("")
  const [professorData, setProfessorData] = useState<any>(null)

  useEffect(() => {
    async function fetchProfessorData() {
      const professorId = getCookie("authenticatedUserId")
      if (!professorId) return

      try {
        const data = await getProfessorData(professorId)
        setProfessorData(data)
      } catch (error) {
        console.error("Failed to fetch professor data:", error)
      }
    }
    fetchProfessorData()
  }, [])

  const handleSubmit = (filters: { type: string; subject: string; group: string }) => {
    const groupId = filters.group
    const date = "2025-02-19 00:00:00"

    // Build the QR value string
    setQrValue(`attendance-${groupId}-${date}`)
  }

  useEffect(() => {
    if (qrValue) {
      console.log("Generated QR Value:", qrValue)
    }
  }, [qrValue])

  return (
    <div className="space-y-6">
      {professorData && (
        <FilterForm
          title="Generiranje QR koda"
          onSubmit={handleSubmit}
          buttonText="Generiraj QR kod"
          subjects={professorData.subjects.map((s: any) => s.subject)}
          subjectTypes={professorData.subjects.flatMap((s: any) => s.subject.subjectTypes.map((st: any) => st.subjectType))}
          groups={professorData.groups}
        />
      )}

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