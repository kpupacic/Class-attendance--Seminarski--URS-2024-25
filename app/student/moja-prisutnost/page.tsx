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
    return <div>Učitavanje podataka...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">Evidencija prisutnosti: {studentData.name}</h1>
        <Link href="/student">
          <Button variant="outline">Povratak</Button>
        </Link>
      </div>
      {studentData.subjects.map((subject: any, subjectIndex: number) => (
        <div key={subjectIndex} className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{subject.subject.name}</h2>
          {subjectTypes
            .filter((type) => studentData.attendance.some((attendance: any) => attendance.subjectId === subject.subject.id && attendance.subjectTypeId === type.id))
            .map((type, typeIndex) => (
              <div key={typeIndex} className="mb-4">
                <h3 className="text-md font-medium text-gray-700 mb-2">{type.name}</h3>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Datum</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Prisutnost</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {studentData.attendance
                      .filter((attendance: any) => attendance.subjectId === subject.subject.id && attendance.subjectTypeId === type.id)
                      .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
                      .map((attendance: any, attendanceIndex: number) => (
                        <tr key={`${subjectIndex}-${typeIndex}-${attendanceIndex}`}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(attendance.date).toLocaleDateString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                            {attendance.present ? (
                              <span className="text-green-500">+</span>
                            ) : (
                              <span className="text-red-500">-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}