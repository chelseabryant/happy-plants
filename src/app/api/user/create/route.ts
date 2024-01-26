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

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(body.password , salt);

    
    try {
    const response = await client.query(`SELECT * FROM accounts WHERE email = '${body.email}';`);
     if (response.rows.length) {
      return new Response(JSON.stringify({success: false}))
     } else {
       const response = await client.query(`INSERT INTO accounts (username, email, password) VALUES ('${body.name}', '${body.email}', '${hash}') RETURNING id, username, email;`);
       return new Response(JSON.stringify({success: true, data: response.rows}))
     }
  } finally {
    client.release();
  }
}