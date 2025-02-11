type User = {
  id: string
  name: string
  email: string
  role: "professor" | "student"
}

const USERS: User[] = [
  {
    id: "1",
    name: "Professor Smith",
    email: "professor@example.com",
    role: "professor",
  },
  {
    id: "2",
    name: "Student Johnson",
    email: "student@example.com",
    role: "student",
  },
]

export function authenticate(email: string, password: string): User | null {
  if (email === "professor@example.com" && password === "prof123") {
    return USERS[0]
  }
  if (email === "student@example.com" && password === "stud123") {
    return USERS[1]
  }
  return null
}

