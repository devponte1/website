import mysql from 'mysql2/promise';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  const { username, password } = await req.json();

  try {
    const db = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    });

    // Find user by username
    const [users] = await db.query('SELECT * FROM users WHERE username = ?', [username]);

    if (users.length === 0 || users[0].password !== password) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 400 });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: users[0].id, username: users[0].username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return new Response(
      JSON.stringify({ success: true, token }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
