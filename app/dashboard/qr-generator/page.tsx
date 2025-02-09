import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import QRGenerator from "../../../components/QRGenerator"

export default function QRGeneratorPage() {
  const cookieStore = cookies()
  const userCookie = cookieStore.get("user")

  if (!userCookie) {
    redirect("/")
  }

  const user = JSON.parse(userCookie.value)

  if (user.role !== "professor") {
    redirect("/dashboard")
  }

  return <QRGenerator />
}

