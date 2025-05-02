// app/api/signup/route.js
import mysql from 'mysql2/promise';
import jwt from 'jsonwebtoken';

// Create pool once (reuse for all requests)
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function POST(req) {
  const { username, password } = await req.json();

  try {
    // Use pool.query directly
    const [existingUser] = await pool.query('SELECT id FROM users WHERE username = ?', [username]);

    if (existingUser.length > 0) {
      return new Response(JSON.stringify({ error: 'Username already exists' }), { status: 400 });
    }

    const [result] = await pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);

    const token = jwt.sign(
      { userId: result.insertId, username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return new Response(
      JSON.stringify({ success: true, token }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': `token=${token}; HttpOnly; Path=/; Max-Age=3600;`,
        },
      }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
