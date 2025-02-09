import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import QRScanner from "../../../components/QRScanner"

export default function QRScannerPage() {
  const cookieStore = cookies()
  const userCookie = cookieStore.get("user")

  if (!userCookie) {
    redirect("/")
  }

  const user = JSON.parse(userCookie.value)

  if (user.role !== "student") {
    redirect("/dashboard")
  }

  return <QRScanner />
}

