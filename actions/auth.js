"use server";

import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import { loginSchema } from "@/lib/validations/authSchema";
import { redirect } from "next/navigation";
import { createSession, deleteSession } from "@/lib/session";
import { UserRole } from "@prisma/client";

export async function auth(prevState, formData) {
  console.log(prevState.message);

  const rawData = {
    identifier: formData.get("identifier"),
    password: formData.get("password"),
  };

  const validatedData = loginSchema.safeParse(rawData);

  if (!validatedData.success) {
    return {
      success: false,
      message: "Periksa kembali input form",
      errors: validatedData.error.flatten().fieldErrors,
      inputs: rawData,
    };
  }

  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: rawData.identifier }, { phone: rawData.identifier }],
    },
  });

  if (!user) {
    return {
      success: false,
      message: "Email/nomor telepon atau kata sandi tidak valid",
      inputs: rawData,
    };
  }

  const isValidPassword = await bcrypt.compare(rawData.password, user.password);

  if (!isValidPassword) {
    return {
      success: false,
      message: "Email/nomor telepon atau kata sandi tidak valid",
      inputs: rawData,
    };
  }
  await createSession(user.id, user.role);
  redirect(
    user.role === UserRole.CUSTOMER
      ? "/"
      : user.role === UserRole.ADMIN
      ? "/dashboard"
      : user.role === UserRole.COURIER
      ? "/dashboard/order"
      : "/"
  );
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
