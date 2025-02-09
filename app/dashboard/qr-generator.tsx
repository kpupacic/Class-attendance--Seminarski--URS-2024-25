"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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
  const [selectedType, setSelectedType] = useState<string>("")
  const [selectedSubject, setSelectedSubject] = useState<string>("")
  const [selectedGroup, setSelectedGroup] = useState<string>("")
  const [qrData, setQrData] = useState("")
  const [QRCode, setQRCode] = useState<any>(null)

  useEffect(() => {
    import("qrcode.react").then((module) => {
      setQRCode(() => module.QRCodeSVG)
    })
  }, [])

  const handleGenerateQR = () => {
    if (!selectedType || !selectedSubject || !selectedGroup) return

    const data = JSON.stringify({
      type: selectedType,
      subject: selectedSubject,
      group: selectedGroup,
      timestamp: new Date().toISOString(),
      professor: "Marjan Sikora", // This would come from auth context in production
    })
    setQrData(data)
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div className="w-64 border-r">
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>MS</AvatarFallback>
            </Avatar>
            <span className="font-medium">Marjan Sikora</span>
          </div>
        </div>
        <nav className="p-2">
          <a href="#" className="block px-4 py-2 text-sm font-medium bg-gray-100 rounded">
            Generiranje QR koda
          </a>
          <a href="#" className="block px-4 py-2 text-sm font-medium text-gray-700">
            Evidencija
          </a>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Lecture type selection */}
          <div className="flex gap-4 items-center">
            {LECTURE_TYPES.map((type) => (
              <div key={type.id} className="flex items-center space-x-2">
                <Checkbox
                  id={type.id}
                  checked={selectedType === type.id}
                  onCheckedChange={() => setSelectedType(type.id)}
                />
                <label
                  htmlFor={type.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {type.label}
                </label>
              </div>
            ))}
          </div>

          {/* Subject selection */}
          <Select onValueChange={setSelectedSubject} value={selectedSubject}>
            <SelectTrigger className="w-full">
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
            <SelectTrigger className="w-full">
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
            className="w-full bg-green-500 hover:bg-green-600"
            disabled={!selectedType || !selectedSubject || !selectedGroup}
          >
            GENERIRAJ QR KOD
          </Button>

          {/* QR Code display */}
          {qrData && QRCode && (
            <div className="flex justify-center pt-6">
              <QRCode value={qrData} size={256} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

