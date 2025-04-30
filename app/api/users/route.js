// app/api/users/route.js
import mysql from 'mysql2/promise'

export async function GET() {
  let db;
  try {
    db = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'IlikesleepP123',
      database: 'websiteDatabase',
    });

    const [rows] = await db.query('SELECT id, username FROM users');
    return new Response(JSON.stringify({ success: true, users: rows }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to fetch users' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  } finally {
    if (db) {
      await db.end(); // Don't forget to close the DB connection
    }
  }
}
