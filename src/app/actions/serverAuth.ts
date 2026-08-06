"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signOut } from "../../../auth";

export async function signUpAction(email: string, password: string) {
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    return {
      success: false,
      error: "Пользователь уже существует",
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    await tx.profile.create({
      data: {
        id: user.id,
      },
    });
  });

  return {
    success: true,
    message: "Регистрация успешна! Теперь войдите.",
  };
}

export async function logoutAction() {
  await signOut();

  return {
    success: true,
  };
}
