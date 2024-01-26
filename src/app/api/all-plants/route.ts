import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';



const pool = new Pool({
    connectionString: process.env.NEON_DB_URL,
    ssl: true
  });
export async function GET(req: NextRequest, res: NextResponse) {
    const client = await pool.connect();

  try {
    const response = await client.query('SELECT * FROM full_plant;');
    return new Response(JSON.stringify(response.rows))
  } finally {
    client.release();
  }
}