"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useActionState, useState } from "react";
import { register } from "@/actions/auth";
import { InputField } from "@/components/inputField";

export default function RegisterForm() {
  const initialState = {
    success: false,
    message: "",
  };

  const [state, action, isPending] = useActionState(register, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <Card className="w-full max-w-md shadow-lg rounded-xl py-8">
      <CardHeader className="pb-2">
        <CardTitle className="text-center text-2xl font-bold">
          Create Account
        </CardTitle>
      </CardHeader>
      <CardContent className="px-8">
        {/* pesan sukses / error */}
        {state.message && (
          <div
            className={`mb-4 text-sm text-center ${
              state.success ? "text-green-600" : "text-red-600"
            }`}
          >
            {state.message}
          </div>
        )}

        <form action={action} className="space-y-4">
          <InputField
            id="name"
            label="Nama"
            placeholder="Masukkan nama lengkap"
            defaultValue={state.inputs?.name}
            required
            autoComplete="name"
            error={state.errors?.name}
          />

          <InputField
            id="email"
            label="Email (Opsional)"
            type="email"
            placeholder="Masukkan email"
            defaultValue={state.inputs?.email}
            autoComplete="email"
            error={state.errors?.email}
          />

          <InputField
            id="phone"
            label="Nomor HP"
            placeholder="Masukkan nomor HP"
            defaultValue={state.inputs?.phone}
            required
            autoComplete="tel"
            error={state.errors?.phone}
          />

          <InputField
            id="password"
            label="Password"
            placeholder="Buat password"
            defaultValue={state.inputs?.password}
            required
            autoComplete="new-password"
            error={state.errors?.password}
            toggle={{
              show: showPassword,
              setShow: () => setShowPassword(!showPassword),
            }}
          />

          <InputField
            id="confirm_password"
            label="Konfirmasi Password"
            placeholder="Ulangi password"
            defaultValue={state.inputs?.confirm_password}
            required
            autoComplete="new-password"
            error={state.errors?.confirm_password}
            toggle={{
              show: showConfirm,
              setShow: () => setShowConfirm(!showConfirm),
            }}
          />

          <Button
            type="submit"
            className="w-full rounded-md font-medium"
            disabled={isPending}
          >
            {isPending ? "Memproses..." : "Submit"}
          </Button>
        </form>

        {/* Link login */}
        <div className="text-center pt-4 text-sm">
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="font-semibold text-primary hover:underline"
          >
            Login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
