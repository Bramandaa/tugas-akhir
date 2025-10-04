import { getSession } from "@/lib/session";
import RegisterForm from "./registerForm";
import { redirect } from "next/navigation";

export default async function RegisterPage() {
  const session = await getSession();

  if (session) {
    redirect("/");
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <RegisterForm />
    </div>
  );
}
