// app/api/userlist/route.js

import pool from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT id, username FROM users');

    return new Response(JSON.stringify({ success: true, users: rows }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Error in /api/userlist:', err);
    return new Response(JSON.stringify({ success: false, message: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
