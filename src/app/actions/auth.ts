"use server";

import { signIn, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if ((error as Error).message?.includes("NEXT_REDIRECT")) {
      throw error;
    }
    return { error: "Geçersiz email veya şifre" };
  }
}

export async function registerAction(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { error: "Tüm alanları doldurunuz" };
  }

  if (password.length < 6) {
    return { error: "Şifre en az 6 karakter olmalıdır" };
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { error: "Bu email zaten kullanılıyor" };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      name,
      email,
      hashedPassword,
    },
  });

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if ((error as Error).message?.includes("NEXT_REDIRECT")) {
      throw error;
    }
    return { error: "Kayıt başarılı, giriş yapılıyor..." };
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/login" });
}
