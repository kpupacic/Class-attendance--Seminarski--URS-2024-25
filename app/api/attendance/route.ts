import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { studentId, groupId, date } = await request.json()

    console.log("Received data:", { studentId, groupId, date })

    if (!studentId || !groupId || !date) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    // Log the records that match the studentId and groupId
    const matchingRecords = await prisma.attendance.findMany({
      where: {
        studentId,
        groupId,
      },
    })
    const utcDate = new Date(date + 'Z')
    console.log("Matching records:", matchingRecords)
    console.log("new date format Date: ", utcDate)
    const updatedAttendance = await prisma.attendance.updateMany({
      where: {
        studentId,
        groupId,
        date: utcDate,
      },
      data: {
        present: true,
      },
    })

    console.log("Updated attendance:", updatedAttendance)

    if (updatedAttendance.count === 0) {
      return NextResponse.json({ error: "No matching record found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating attendance:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}