import mysql from 'mysql2/promise';
import jwt from 'jsonwebtoken';
import { getOrigin, getCorsHeaders, buildCookie } from '@/lib/corsAndCookie';

// MySQL connection pool
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function OPTIONS(req) {
  const origin = getOrigin(req);
  return new Response(null, {
    status: 204,
    headers: {
      ...getCorsHeaders(origin),
      'Content-Type': 'application/json',
    },
  });
}

export async function POST(req) {
  const origin = getOrigin(req);
  const { username, password } = await req.json();
  
  console.log('POST request received with:', { username, password });

  try {
    // Check if username exists
    const [existingUser] = await pool.query('SELECT id FROM users WHERE username = ?', [username]);
    if (existingUser.length > 0) {
      return new Response(JSON.stringify({ error: 'Username already exists' }), {
        status: 400,
        headers: {
          ...getCorsHeaders(origin),
          'Content-Type': 'application/json',
        },
      });
    }

    // Insert new user
    const [result] = await pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);

    // Create JWT token
    const token = jwt.sign(
      { userId: result.insertId, username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );


    const cookieHeader = buildCookie(token, true); // Add 'true' to ensure secure cookies

    console.log('Set-Cookie Header:', cookieHeader); //DEBUG
    

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        ...getCorsHeaders(origin),
        'Set-Cookie': cookieHeader,
        'Content-Type': 'application/json',
      },
    });

  } catch (err) {
    console.error('Error occurred during sign-up:', err);
    return new Response(JSON.stringify({ error: `Database error: ${err.message}` }), {
      status: 500,
      headers: {
        ...getCorsHeaders(origin),
        'Content-Type': 'application/json',
      },
    });
  }
}
