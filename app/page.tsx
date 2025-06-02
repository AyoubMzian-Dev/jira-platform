import { redirect } from "next/navigation"
import { LoginForm } from "@/components/login-form"
import { getUser } from "@/lib/auth"

export default async function LoginPage() {
  const user = await getUser()

  if (user) {
    redirect("/dashboard")
  }

  return <LoginForm />
}
