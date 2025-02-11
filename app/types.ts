export type AttendanceRecord = {
  id: string
  date: string
  subject: string
  type: string
  present: boolean
}

export type FilterState = {
  type: string
  subject: string
  group: string
}

