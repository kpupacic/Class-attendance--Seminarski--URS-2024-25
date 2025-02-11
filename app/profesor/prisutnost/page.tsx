"use client"

import { useState } from "react"
import { FilterForm } from "@/components/filter-form"
import { AttendanceResults } from "@/components/attendance-results"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const DUMMY_ATTENDANCE = [
  {
    id: "1",
    date: "2024-02-11",
    subject: "Matematika",
    type: "Predavanja",
    present: true,
  },
  {
    id: "2",
    date: "2024-02-10",
    subject: "Fizika",
    type: "Laboratorijske vježbe",
    present: false,
  },
  {
    id: "3",
    date: "2024-02-09",
    subject: "Programiranje",
    type: "Auditorne vježbe",
    present: true,
  },
]

export default function AttendancePage() {
  const [filteredRecords, setFilteredRecords] = useState<typeof DUMMY_ATTENDANCE>([])
  const [currentFilters, setCurrentFilters] = useState<{
    type: string
    subject: string
    group: string
  } | null>(null)

  const handleFilter = (filters: { type: string; subject: string; group: string }) => {
    const filtered = DUMMY_ATTENDANCE.filter((record) => {
      const matchesType = !filters.type || record.type === filters.type
      const matchesSubject = !filters.subject || record.subject === filters.subject
      return matchesType && matchesSubject
    })
    setFilteredRecords(filtered)
    setCurrentFilters(filters)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">Pregled Prisutnosti</h1>
        <Link href="/profesor">
          <Button variant="outline">Natrag</Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <FilterForm title="Pregled Prisutnosti" onSubmit={handleFilter} buttonText="Filtriraj" />
        </div>

        {currentFilters && (
          <div>
            <AttendanceResults records={filteredRecords} isTeacher filters={currentFilters} />
          </div>
        )}
      </div>
      <div className="mt-6 text-sm text-muted-foreground">
        <p className="mb-2">Primjer podataka za testiranje:</p>
        <ul className="space-y-1">
          {DUMMY_ATTENDANCE.map((record, index) => (
            <li key={index}>
              • {record.date}: {record.subject}, {record.type}, {record.present ? "Prisutan" : "Odsutan"}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

