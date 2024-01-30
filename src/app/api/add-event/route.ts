import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';



const pool = new Pool({
    connectionString: process.env.NEON_DB_URL,
    ssl: true
  });
export async function POST(req: NextRequest, res: NextResponse) {
    const client = await pool.connect();
    const body = await req.json()

  try {
    const response = await client.query(`INSERT INTO my_plants (user_id, plant_id) VALUES ('${body.user}', ${body.plant});`);
    return new Response(JSON.stringify(response.rows))
  } finally {
    client.release();
  }
}