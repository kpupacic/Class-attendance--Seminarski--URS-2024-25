import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type AttendanceRecord = {
  id: string
  date: string
  subject: string
  type: string
  present: boolean
}

type AttendanceTableProps = {
  records: AttendanceRecord[]
  isTeacher?: boolean
}

export function AttendanceTable({ records, isTeacher = false }: AttendanceTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Datum</TableHead>
            <TableHead>Predmet</TableHead>
            <TableHead>Tip nastave</TableHead>
            {isTeacher && <TableHead>Student</TableHead>}
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record.id}>
              <TableCell>{record.date}</TableCell>
              <TableCell>{record.subject}</TableCell>
              <TableCell>{record.type}</TableCell>
              {isTeacher && <TableCell>Student Johnson</TableCell>}
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-sm ${
                    record.present ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {record.present ? "Prisutan" : "Odsutan"}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

