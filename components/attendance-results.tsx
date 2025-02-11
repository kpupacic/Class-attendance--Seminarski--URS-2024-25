import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AttendanceTable } from "./attendance-table"

type AttendanceRecord = {
  id: string
  date: string
  subject: string
  type: string
  present: boolean
}

type AttendanceResultsProps = {
  records: AttendanceRecord[]
  isTeacher?: boolean
  filters: {
    type: string
    subject: string
    group: string
  }
}

export function AttendanceResults({ records, isTeacher, filters }: AttendanceResultsProps) {
  const getFilterSummary = () => {
    const parts = []
    if (filters.subject) {
      parts.push(`Predmet: ${filters.subject}`)
    }
    if (filters.type) {
      parts.push(`Tip: ${filters.type}`)
    }
    if (filters.group) {
      parts.push(`Grupa: ${filters.group}`)
    }
    return parts.join(" | ") || "Svi zapisi"
  }

  return (
    <Card>
      <CardHeader className="bg-blue-600 text-white rounded-t-lg">
        <CardTitle className="text-center">Rezultati Pregleda</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="mb-4 text-sm text-muted-foreground">{getFilterSummary()}</div>
        <AttendanceTable records={records} isTeacher={isTeacher} />
      </CardContent>
    </Card>
  )
}

