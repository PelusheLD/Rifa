import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "../shared/schema.js";
// Configure WebSockets for Neon
neonConfig.webSocketConstructor = ws;
// Verify that the DATABASE_URL environment variable is set
if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
}
// Create a pool connection to the PostgreSQL database
export var pool = new Pool({ connectionString: process.env.DATABASE_URL });
// Create a Drizzle ORM instance with the schema
export var db = drizzle(pool, { schema: schema });
