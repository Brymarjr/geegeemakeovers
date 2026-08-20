// src/db/index.ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is missing in environment variables");
}

// Caching the connection to prevent exhaustion during Next.js Hot Reloads
const globalForDb = globalThis as unknown as {
  postgresConnection: postgres.Sql | undefined;
};

const sql = globalForDb.postgresConnection ?? postgres(connectionString, { max: 10 });

if (process.env.NODE_ENV !== "production") {
  globalForDb.postgresConnection = sql;
}

export const db = drizzle(sql, { schema });