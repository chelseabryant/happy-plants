import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';



const pool = new Pool({
    connectionString: process.env.NEON_DB_URL,
    ssl: true
  });
export async function DELETE(req: NextRequest, res: NextResponse) {
    const client = await pool.connect();
    const user = req.url.split('=')
    const plant = req.url.split('plant/')
    const plantId = plant[1].split('?')

  try {
    const response = await client.query(`DELETE FROM my_plants WHERE user_id = ${user[1]} AND plant_id = ${plantId[0]};`);
    return new Response(JSON.stringify(response.rows))
  } finally {
    client.release();
  }
}