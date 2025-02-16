"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

async function getStudentData(studentId: string) {
  const response = await fetch(`/api/students/${studentId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch student data');
  }
  return response.json();
}

export default function AttendancePage() {
  const [studentData, setStudentData] = useState<any>(null);
  const [subjectTypes, setSubjectTypes] = useState<any[]>([]);

  useEffect(() => {
    async function fetchStudentData() {
      const studentId = getCookie("authenticatedUserId");
      if (!studentId) return;

      try {
        const { student, subjectTypes } = await getStudentData(studentId);
        setStudentData(student);
        setSubjectTypes(subjectTypes);
      } catch (error) {
        console.error('Failed to fetch student data:', error);
      }
    }

    fetchStudentData();
  }, []);

  if (!studentData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">Evidencija prisutnosti: {studentData.name}</h1>
        <Link href="/student">
          <Button variant="outline">Back</Button>
        </Link>
      </div>

      {studentData.subjects.map((subject: any, index: number) => (
        <div key={index}>
          <h2 className="text-xl font-bold text-blue-600">{subject.subject.name}</h2>
          {subjectTypes
            .filter((type) => studentData.attendance.some((attendance: any) => attendance.subjectId === subject.subject.id && attendance.subjectTypeId === type.id))
            .map((type) => (
              <div key={type.id}>
                <h3 className="text-lg font-bold text-blue-600">{type.name}</h3>
                <ul className="list-disc pl-5">
                  {studentData.attendance
                    .filter((attendance: any) => attendance.subjectId === subject.subject.id && attendance.subjectTypeId === type.id)
                    .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .map((attendance: any, index: number) => (
                      <li key={index}>
                        {new Date(attendance.date).toLocaleDateString()} {attendance.present ? "+" : "-"}
                      </li>
                    ))}
                </ul>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}