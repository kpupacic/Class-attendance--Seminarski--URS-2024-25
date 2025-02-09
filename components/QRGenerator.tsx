"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Button } from "./ui/button"
import { Checkbox } from "./ui/checkbox"
import { useAuth } from "./AuthProvider"
import dynamic from "next/dynamic"

const QRCode = dynamic(() => import("qrcode.react").then((mod) => mod.QRCodeSVG), { ssr: false })

// Mock data - to be replaced with Contentful data
const SUBJECTS = [
  { id: "250", name: "Napredne Web tehnologije" },
  { id: "251", name: "Programiranje za Web" },
  { id: "252", name: "Baze podataka" },
]

const GROUPS = Array.from({ length: 8 }, (_, i) => `grupa ${i + 1}`)

const LECTURE_TYPES = [
  { id: "predavanja", label: "predavanja" },
  { id: "av", label: "AV" },
  { id: "labovi", label: "labovi" },
  { id: "itd", label: "itd..." },
]

export default function QRGenerator() {
  const { user } = useAuth()
  const [selectedType, setSelectedType] = useState<string>("")
  const [selectedSubject, setSelectedSubject] = useState<string>("")
  const [selectedGroup, setSelectedGroup] = useState<string>("")
  const [qrData, setQrData] = useState("")

  const handleGenerateQR = () => {
    if (!selectedType || !selectedSubject || !selectedGroup) return

    const data = JSON.stringify({
      type: selectedType,
      subject: selectedSubject,
      group: selectedGroup,
      timestamp: new Date().toISOString(),
      professor: user?.name,
      url: process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000",
    })
    setQrData(data)
  }

  return (
    <div className="min-h-screen bg-blue-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-blue-800">Generate QR Code</h1>
        <div className="space-y-6">
          {/* Lecture type selection */}
          <div className="flex flex-wrap gap-4">
            {LECTURE_TYPES.map((type) => (
              <div key={type.id} className="flex items-center space-x-2">
                <Checkbox
                  id={type.id}
                  checked={selectedType === type.id}
                  onCheckedChange={(checked) => setSelectedType(checked ? type.id : "")}
                />
                <label
                  htmlFor={type.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-blue-700"
                >
                  {type.label}
                </label>
              </div>
            ))}
          </div>

          {/* Subject selection */}
          <Select onValueChange={setSelectedSubject} value={selectedSubject}>
            <SelectTrigger className="w-full border-blue-300">
              <SelectValue placeholder="Odaberi predmet" />
            </SelectTrigger>
            <SelectContent>
              {SUBJECTS.map((subject) => (
                <SelectItem key={subject.id} value={subject.id}>
                  ({subject.id}) {subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Group selection */}
          <Select onValueChange={setSelectedGroup} value={selectedGroup}>
            <SelectTrigger className="w-full border-blue-300">
              <SelectValue placeholder="Odaberi grupu" />
            </SelectTrigger>
            <SelectContent>
              {GROUPS.map((group) => (
                <SelectItem key={group} value={group}>
                  {group}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Generate button */}
          <Button
            onClick={handleGenerateQR}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={!selectedType || !selectedSubject || !selectedGroup}
          >
            GENERIRAJ QR KOD
          </Button>

          {/* QR Code display */}
          {qrData && (
            <div className="flex justify-center pt-6">
              <QRCode value={qrData} size={256} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

