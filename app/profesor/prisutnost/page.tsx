"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

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

export default function AttendancePage() {
  const [professorData, setProfessorData] = useState<any>(null)
  const [selectedSubject, setSelectedSubject] = useState<string>("")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [students, setStudents] = useState<any[]>([])

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

  // When the subject changes, collect students + attendance for that subject
  useEffect(() => {
    if (!selectedSubject || !professorData) return

    const subjectWrapper = professorData.subjects.find(
      (s: any) => s.subject.id === selectedSubject
    )
    if (!subjectWrapper) return

    const studentsWithAttendance = subjectWrapper.subject.students.map(
      (studentSub: any) => {
        const student = studentSub.student
        const studentAttendance = student.attendance.filter(
          (att: any) => att.subjectId === selectedSubject
        )
        return { ...student, attendance: studentAttendance }
      }
    )

    setStudents(studentsWithAttendance)
  }, [selectedSubject, professorData])

  if (!professorData) {
    return <div>Učitavanje podataka...</div>
  }

  // Find the chosen subject's details to list its subjectTypes
  const subjectWrapper = professorData.subjects.find(
    (s: any) => s.subject.id === selectedSubject
  )
  const subjectTypes = subjectWrapper?.subject.subjectTypes || []

  // Filter which subjectTypes to display based on selectedType
  const displayedSubjectTypes =
    selectedType === "all"
      ? subjectTypes
      : subjectTypes.filter((st: any) => st.subjectType.id === selectedType)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">Pregled prisutnosti studenata: {professorData.name}</h1>
        <Link href="/profesor">
          <Button variant="outline">Povratak</Button>
        </Link>
      </div>

    {/* Subject dropdown */}
    <div className="flex space-x-8">
      <div>
        <h3 className="text-lg font-bold">Odabir kolegija:</h3>
        <select
          className="bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-600"
          onChange={(e) => {
            setSelectedSubject(e.target.value)
            setSelectedType("all") // Reset subject type on subject change
          }}
          value={selectedSubject}
        >
          <option value="" disabled>
            naziv kolegija
          </option>
          {professorData.subjects.map((subject: any) => (
            <option key={subject.subject.id} value={subject.subject.id}>
              {subject.subject.name}
            </option>
          ))}
        </select>
      </div>

      {selectedSubject && (
        <div>
          <h3 className="text-lg font-bold">Tip nastave:</h3>
          <select
            className="bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-600"
            onChange={(e) => setSelectedType(e.target.value)}
            value={selectedType}
          >
            <option value="all">Sve</option>
            {subjectTypes.map((st: any) => (
              <option key={st.subjectType.id} value={st.subjectType.id}>
                {st.subjectType.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>

      {/* Display student attendance grouped by subject type */}
{selectedSubject && (
  <div>
    <h3 className="text-lg font-bold">Evidencija studenata:</h3>
    {displayedSubjectTypes.map((st: any) => (
      <div key={st.subjectType.id} className="my-4 p-2 border rounded">
        <h4 className="font-semibold text-blue-700">{st.subjectType.name}</h4>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-left">Ime studenta</th>
              <th className="py-2 px-4 border-b text-center">Datum</th>
              <th className="py-2 px-4 border-b text-center">Prisutnost</th>
              <th className="py-2 px-4 border-b text-center">Grupa</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student: any) => {
              const typeSpecificAttendance = student.attendance
                .filter((att: any) => att.subjectTypeId === st.subjectType.id)
                .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())

              return (
                <tr key={student.id}>
                  <td className="py-2 px-4 border-b text-left">{student.name}</td>
                  <td className="py-2 px-4 border-b text-center">
                    <ul>
                      {typeSpecificAttendance.length > 0 ? (
                        typeSpecificAttendance.map((att: any) => (
                          <li key={att.id}>
                            {new Date(att.date).toLocaleDateString()}
                          </li>
                        ))
                      ) : (
                        <li>No attendance records for this type.</li>
                      )}
                    </ul>
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    <ul>
                      {typeSpecificAttendance.length > 0 ? (
                        typeSpecificAttendance.map((att: any) => (
                          <li key={att.id}>
                            {att.present ? (
                              <span style={{ color: 'green' }}>+</span>
                            ) : (
                              <span style={{ color: 'red' }}>-</span>
                            )}
                          </li>
                        ))
                      ) : (
                        <li>No attendance records for this type.</li>
                      )}
                    </ul>
                  </td>
                  {/* Show the group from the first attendance record if present */}
                  <td className="py-2 px-4 border-b text-center">
                    {typeSpecificAttendance.length > 0 ? (
                      typeSpecificAttendance[0].group.name
                    ) : (
                      "No attendance records for this type."
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    ))}
  </div>
)}
</div>
)
}