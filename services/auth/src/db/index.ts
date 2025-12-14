import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "../config/env";

const pool = new Pool({
	connectionString: env.DATABASE_URL,
	ssl: env.NODE_ENV === "production",
	max: 10,
	idleTimeoutMillis: 30000,
	connectionTimeoutMillis: 2000,
});

export const db = drizzle({ client: pool });
