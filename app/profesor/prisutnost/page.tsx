"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

async function getProfessorData(professorId: string) {
  const response = await fetch(`/api/professors/${professorId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch professor data");
  }
  return response.json();
}

export default function AttendancePage() {
  const [professorData, setProfessorData] = useState<any>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedSubjectType, setSelectedSubjectType] = useState<string | null>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [dates, setDates] = useState<string[]>([]);
  const [subjectTypes, setSubjectTypes] = useState<any[]>([]);

  // Fetch professor data on first load
  useEffect(() => {
    async function fetchProfessorData() {
      const professorId = getCookie("authenticatedUserId");
      console.log("Cookie professorId:", professorId);

      if (!professorId) {
        console.log("No professor ID found in the cookie.");
        return;
      }

      try {
        const data = await getProfessorData(professorId);
        console.log("Fetched professor data:", data);
        setProfessorData(data);
      } catch (error) {
        console.error("Failed to fetch professor data:", error);
      }
    }
    fetchProfessorData();
  }, []);

  // Load the chosen subject's students & subject types
  useEffect(() => {
    console.log("useEffect for subject/student loading triggered:", {
      professorData,
      selectedSubject
    });

    if (!professorData || !selectedSubject) {
      console.log("Skipping: no professorData or no selectedSubject");
      return;
    }

    const subjectRecord = professorData.subjects.find((s: any) => s.subject.id === selectedSubject);
    console.log("Found subjectRecord:", subjectRecord);

    if (!subjectRecord || !subjectRecord.subject.attendance) {
      console.log("Skipping: no subjectRecord or no subject attendance");
      return;
    }

    // 1) Extract all subject types for the chosen subject
    const typeEntries = subjectRecord.subject.subjectTypes.map((st: any) => st.subjectType);
    console.log("Extracted subjectTypes:", typeEntries);
    setSubjectTypes(typeEntries);

    // 2) Extract all students for the chosen subject
    const allStudents = subjectRecord.subject.students.map((s: any) => s.student);
    console.log("Extracted students for subject:", allStudents);
    setStudents(allStudents);
  }, [professorData, selectedSubject]);

  // When both a subject and a subject type are selected, collect relevant attendance dates
  useEffect(() => {
    console.log("useEffect for attendance date calculations triggered:", {
      professorData,
      selectedSubject,
      selectedSubjectType
    });

    if (!professorData || !selectedSubject || !selectedSubjectType) {
      console.log("Skipping: missing required data to filter attendance.");
      return;
    }

    const subjectRecord = professorData.subjects.find((s: any) => s.subject.id === selectedSubject);
    if (!subjectRecord || !subjectRecord.subject.attendance) {
      console.log("Skipping: no attendance data for this subject.");
      return;
    }

    // Filter the attendance records to the chosen subject AND subjectType
    const filteredAttendance = subjectRecord.subject.attendance.filter(
      (a: any) => a.subjectTypeId === selectedSubjectType
    );
    console.log("Filtered attendance for subject + subjectType:", filteredAttendance);

    // Collect unique dates from that filtered set
    const uniqueDates = Array.from(new Set(filteredAttendance.map((a: any) => a.date))) as string[];
    uniqueDates.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    console.log("Unique sorted dates:", uniqueDates);
    setDates(uniqueDates);
  }, [professorData, selectedSubject, selectedSubjectType]);

  if (!professorData) {
    return <div>Loading...</div>;
  }

  // Sort groups numerically by name
  const sortedGroups = [...professorData.groups].sort(
    (a: any, b: any) => parseInt(a.name, 10) - parseInt(b.name, 10)
  );

  console.log("Rendering AttendancePage with final state:", {
    selectedSubject,
    selectedSubjectType,
    subjectTypes,
    students,
    dates,
    sortedGroups
  });

  return (
    <div className="space-y-6">
      {/* Page Title and Back Button */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">
          Evidencija po predmetima: {professorData.name}
        </h1>
        <Link href="/profesor">
          <Button variant="outline">Back</Button>
        </Link>
      </div>

      {/* Subject Selection */}
      <div>
        <h3 className="text-lg font-bold">Select Subject:</h3>
        <select
          onChange={(e) => {
            setSelectedSubject(e.target.value);
            setSelectedSubjectType(null); // reset subject type when changing subject
            setDates([]);
          }}
          value={selectedSubject || ""}
        >
          <option value="" disabled>Select a subject</option>
          {professorData.subjects.map((item: any) => (
            <option key={item.subject.id} value={item.subject.id}>
              {item.subject.name}
            </option>
          ))}
        </select>
      </div>

      {/* Subject Type Selection */}
      {selectedSubject && (
        <div>
          <h3 className="text-lg font-bold">Select Subject Type:</h3>
          <select
            onChange={(e) => setSelectedSubjectType(e.target.value)}
            value={selectedSubjectType || ""}
          >
            <option value="" disabled>Select a subject type</option>
            {subjectTypes.map((type: any) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Attendance Matrix */}
      {selectedSubject && selectedSubjectType && dates.length > 0 && (
        <div>
          {sortedGroups.map((group: any, groupIndex: number) => {
            // Filter students in this group who actually have attendance for subject + type
            const relevantStudents = students.filter((student: any) => {
              // Student must be in this group
              const inGroup = student.groups?.some((g: any) => g.groupId === group.id);

              // Must have at least one relevant attendance record
              const hasAttendance = student.attendance?.some(
                (a: any) =>
                  a.subjectId === selectedSubject &&
                  a.subjectTypeId === selectedSubjectType
              );

              return inGroup && hasAttendance;
            });

            if (!relevantStudents.length) return null; // Skip empty groups

            return (
              <div key={groupIndex}>
                <h3 className="text-lg font-bold">Group {group.name}</h3>
                <table className="min-w-full bg-white border">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border">Student Name</th>
                      {dates.map((date, dateIndex) => (
                        <th key={dateIndex} className="py-2 px-4 border">
                          {new Date(date).toLocaleDateString()}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {relevantStudents.map((student: any, index: number) => (
                      <tr key={index}>
                        <td className="py-2 px-4 border">{student.name}</td>
                        {dates.map((date, dateIndex) => {
                          const record = student.attendance?.find(
                            (a: any) =>
                              a.date === date &&
                              a.subjectId === selectedSubject &&
                              a.subjectTypeId === selectedSubjectType
                          );
                          return (
                            <td key={dateIndex} className="py-2 px-4 border">
                              {record ? (record.present ? "+" : "-") : ""}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      )}

      {selectedSubject && selectedSubjectType && dates.length === 0 && (
        <div>No attendance records found for this subject type.</div>
      )}
    </div>
  );
}