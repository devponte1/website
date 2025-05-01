// app/api/signup/route.js
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

    // Check if username already exists
    const [existingUser] = await db.query('SELECT id FROM users WHERE username = ?', [username]);

    if (existingUser.length > 0) {
      return new Response(JSON.stringify({ error: 'Username already exists' }), { status: 400 });
    }

    // Insert new user
    const [result] = await db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);

    // Create a JWT token
    const token = jwt.sign({ userId: result.insertId, username }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return new Response(
      JSON.stringify({ success: true, token }), 
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Set-Cookie': `token=${token}; HttpOnly; Path=/; Max-Age=3600;` }
      }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
