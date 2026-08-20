"use server";

import { db } from "@/db";
import { admins } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { redirect } from "next/navigation";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET);

export async function loginAdmin(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { success: false, error: "Email and password are required." };
  }

  try {
    const adminRecord = await db.query.admins.findFirst({
      where: eq(admins.email, email),
    });

    if (!adminRecord) {
      return { success: false, error: "Invalid credentials." };
    }

    const passwordMatch = await bcrypt.compare(password, adminRecord.passwordHash);

    if (!passwordMatch) {
      return { success: false, error: "Invalid credentials." };
    }

    const token = await new SignJWT({ 
      adminId: adminRecord.id, 
      requiresChange: adminRecord.requiresPasswordChange 
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("8h")
      .sign(SECRET_KEY);

    const cookieStore = await cookies();
    cookieStore.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 8, // 8 hours
      path: "/",
    });

    return { success: true };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "An internal error occurred." };
  }
}

export async function setupNewPassword(formData: FormData) {
  const newPassword = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!newPassword || newPassword.length < 8) {
    return { success: false, error: "Password must be at least 8 characters long." };
  }

  if (newPassword !== confirmPassword) {
    return { success: false, error: "Passwords do not match." };
  }

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_session")?.value;

    if (!token) {
      return { success: false, error: "Unauthorized access." };
    }

    // Verify current token to get the admin ID
    const { payload } = await jwtVerify(token, SECRET_KEY);
    const adminId = payload.adminId as string;

    // Hash the new private password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the database and remove the forced change flag
    await db.update(admins)
      .set({ 
        passwordHash: hashedPassword, 
        requiresPasswordChange: false 
      })
      .where(eq(admins.id, adminId));

    // Issue a fresh JWT with the requiresChange flag set to false
    const newToken = await new SignJWT({ 
      adminId, 
      requiresChange: false 
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("8h")
      .sign(SECRET_KEY);

    cookieStore.set("admin_session", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 8,
      path: "/",
    });

    return { success: true };
  } catch (error) {
    console.error("Password setup error:", error);
    return { success: false, error: "Failed to update password." };
  }
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  redirect("/dashboard/login");
}