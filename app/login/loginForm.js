"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCard } from "../../components/alert";
import { useActionState, useState } from "react";
import { auth } from "../../actions/auth";
import { InputField } from "@/components/inputField";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LoginForm() {
  const initialState = {
    success: false,
    message: "",
  };

  const [state, action, isPending] = useActionState(auth, initialState);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (formData) => {
    state.message = "";
    action(formData);
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-gray-50 text-primary">
      <Card className="w-full max-w-sm shadow-lg rounded-lg px-4">
        <CardHeader className="space-y-2">
          <CardTitle className="text-center text-2xl font-bold">
            Login
          </CardTitle>
          {state?.message && <AlertCard message={state?.message} />}
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            action={(formData) => handleLogin(formData)}
          >
            {/* Identifier */}
            <InputField
              id="identifier"
              name="identifier"
              label="Email / Nomor HP"
              type="text"
              placeholder="Masukkan email atau No. HP"
              defaultValue={state.inputs?.identifier ?? "081234567890"}
              required
              error={state?.errors?.identifier?.[0]}
            />

            {/* Password */}
            <InputField
              id="password"
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Masukkan password"
              defaultValue={state.inputs?.password ?? "12345678"}
              required
              minLength={7}
              autoComplete="current-password"
              error={state?.errors?.password?.[0]}
              toggle={{
                show: showPassword,
                setShow: () => setShowPassword(!showPassword),
              }}
            />

            {/* Tombol submit */}
            <Button
              type="submit"
              className="w-full rounded-md font-medium cursor-pointer"
              disabled={isPending}
            >
              {isPending ? "Memproses..." : "Login"}
            </Button>
          </form>

          {/* Link register */}
          <div className="text-center pt-4 text-sm">
            Belum punya akun?{" "}
            <Link href="/register">
              <span className="font-semibold text-primary hover:underline">
                Register
              </span>
            </Link>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
