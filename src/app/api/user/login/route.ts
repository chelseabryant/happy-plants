import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
const bcrypt = require('bcrypt');



const pool = new Pool({
    connectionString: process.env.NEON_DB_URL,
    ssl: true
  });
export async function POST(req: NextRequest, res: NextResponse) {
    const client = await pool.connect();
    const body = await req.json()


try {
    const response = await client.query(`SELECT * FROM accounts WHERE email = '${body.email}';`);
    if (response.rows.length) {
        const authenticated = bcrypt.compareSync(body.password, response.rows[0].password)
        if (authenticated) {
            delete response.rows[0].password
            return new Response(JSON.stringify({success: true, data: response.rows[0]}))
        }
    }
    return new Response(JSON.stringify({success: false}))
} finally {
    client.release();
  }
}