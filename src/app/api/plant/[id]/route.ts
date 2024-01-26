import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.NEON_DB_URL,
    ssl: true
  });
export async function GET(req: NextRequest, {params: {id}}: {params: {id: string}}) {
    const client = await pool.connect();
    const user = req.url.includes("user_id")
    if (user) {
      const userId = req.url.split('=')
      try {
        const plantResponse = await client.query(`SELECT * FROM my_plants WHERE user_id = ${userId[1]} AND plant_id = ${id};`);
        const plant = plantResponse.rows
        const response = await client.query(`SELECT * FROM full_plant WHERE id = ${id};`);
        if (plant.length) {
          return new Response(JSON.stringify({success: true, data: response.rows}))
        }
         return new Response(JSON.stringify({succes: false, data: response.rows}))
      } finally {
        client.release();
      }
    }
    try {
      const response = await client.query(`SELECT * FROM full_plant WHERE id = ${id};`);
      return new Response(JSON.stringify({success: false, data: response.rows}))

    } finally {
      client.release();
    }

}
