// app/users/route.js
import mysql from 'mysql2/promise'

export async function GET() {
  try {
    const db = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'IlikesleepP123',
      database: 'websiteDatabase',
    })

    const [rows] = await db.query('SELECT id, username FROM users')

    return new Response(JSON.stringify({ success: true, users: rows }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, message: err.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
