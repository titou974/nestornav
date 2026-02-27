"use server";

import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createTenantSchema } from "@/lib/validations";
import { signIn, signOut } from "next-auth/react";

export async function signUpAction(formData: FormData) {
  try {
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      name: formData.get("name") as string,
      company: formData.get("company") as string,
    };

    const validated = createTenantSchema.parse(data);

    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (existingUser) {
      return {
        success: false,
        error: "Un compte avec cet email existe déjà",
      };
    }

    const hashedPassword = await hash(validated.password, 10);

    const tenant = await prisma.tenant.create({
      data: {
        email: validated.email,
        password: hashedPassword,
        name: validated.name,
        company: validated.company,
      },
    });

    await prisma.user.create({
      data: {
        email: validated.email,
        name: validated.name,
        tenantId: tenant.id,
        emailVerified: new Date(),
      },
    });

    return {
      success: true,
      message: "Compte créé avec succès",
    };
  } catch (error) {
    console.error("Sign up error:", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de la création du compte",
    };
  }
}

export async function signInAction(email: string, password: string) {
  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      return {
        success: false,
        error: "Email ou mot de passe incorrect",
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("Sign in error:", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de la connexion",
    };
  }
}

export async function signOutAction() {
  await signOut({ redirect: true, callbackUrl: "/patron/login" });
}
