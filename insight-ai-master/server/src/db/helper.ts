import { createPool, Pool } from "mysql2/promise";

let pool: Pool | null = null;

export async function getPool() {
  if (pool == null) {
    pool = await setupPool();
    return pool;
  } else {
    return pool;
  }
}

async function setupPool() {
  return createPool({
    user: "root",
    password: "parker",
    database: "swim_roster_pro",
    host: "0.0.0.0",
    port: 3306,
  });
}

export async function executeQuery(sql: string): Promise<any[]> {
  const pool = await getPool();
  const [rows, fields] = await pool.execute(sql);

  return rows as any[];
}
