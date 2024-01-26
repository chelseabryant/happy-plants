import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';



const pool = new Pool({
    connectionString: process.env.NEON_DB_URL,
    ssl: true
  });
export async function GET(req: NextRequest, {params: {id}}: {params: {id: string}}) {
    const client = await pool.connect();

    try {
    const response = await client.query(`SELECT full_plant.id, full_plant.name, full_plant.image FROM my_plants INNER JOIN full_plant ON my_plants.plant_id = full_plant.id WHERE my_plants.user_id = ${id};`);
    return new Response(JSON.stringify(response.rows))
  } finally {
    client.release();
  }
}
