// app/api/signup/route.js
import mysql from 'mysql2/promise';
import jwt from 'jsonwebtoken';

// MySQL connection pool
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,  // Use '127.0.0.1' for local
  user: process.env.MYSQL_USER,  // 'root' or your MySQL username
  password: process.env.MYSQL_PASSWORD,  // Your MySQL password
  database: process.env.MYSQL_DATABASE,  // Your MySQL database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function POST(req) {
  const { username, password } = await req.json();

  try {
    // Check if username exists
    const [existingUser] = await pool.query('SELECT id FROM users WHERE username = ?', [username]);
    if (existingUser.length > 0) {
      return new Response(
        JSON.stringify({ error: 'Username already exists' }),
        { status: 400 }
      );
    }

    // Insert new user
    const [result] = await pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);

    // Create JWT token
    const token = jwt.sign(
      { userId: result.insertId, username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Return response with token
    return new Response(
      JSON.stringify({ success: true, token }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': `token=${token}; HttpOnly; Path=/; Max-Age=3600; SameSite=Strict;`,
        },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: `Database error: ${err.message}` }),
      { status: 500 }
    );
  }
}
