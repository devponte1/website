// app/api/userlist/route.js
import mysql from 'mysql2/promise';

export async function GET() {
  try {
    console.log('Connecting to DB...');
    const db = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    });
    console.log('DB connected');

    const [rows] = await db.query('SELECT id, username FROM users');
    console.log('Query result:', rows);

    return new Response(JSON.stringify({ success: true, users: rows }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Error in /api/userlist:', err);
    return new Response(
      JSON.stringify({ success: false, message: err.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
