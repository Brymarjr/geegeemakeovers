import { db } from "../db";
import { admins } from "../db/schema";
import bcrypt from "bcryptjs";

async function seedDeveloperAdmin() {
  try {
    // Generate a secure hash for the temporary password
    const temporaryPassword = "Adminpass2026";
    const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

    // Insert the developer record
    await db.insert(admins).values({
      email: "braimaholatilewa@gmail.com",
      passwordHash: hashedPassword,
      requiresPasswordChange: true, // Forces you to change it on first login
    });

    console.log("Successfully seeded developer admin account.");
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed admin account:", error);
    process.exit(1);
  }
}

seedDeveloperAdmin();