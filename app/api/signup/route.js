import mysql from 'mysql2/promise';
import jwt from 'jsonwebtoken';

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

// Allowed frontend origins
const allowedOrigins = [
  'https://website1-devponte1s-projects.vercel.app',
  'http://localhost:3000'
  // <-- add more domains as needed
];

// Dynamically generate CORS headers
function getCorsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : '',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Credentials': 'true',
  };
}

export async function OPTIONS(req) {
  const origin = req.headers.get('Origin');
  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(origin),
  });
}

export async function POST(req) {
  const origin = req.headers.get('Origin');
  const corsHeaders = getCorsHeaders(origin);
  const { username, password } = await req.json();

  try {
    // Check if username exists
    const [existingUser] = await pool.query('SELECT id FROM users WHERE username = ?', [username]);
    if (existingUser.length > 0) {
      return new Response(
        JSON.stringify({ error: 'Username already exists' }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Insert new user with the full timestamp as join_date
    const [result] = await pool.query(
      'INSERT INTO users (username, password, join_date) VALUES (?, ?, NOW())',
      [username, password]
    );

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
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Set-Cookie': `token=${token}; HttpOnly; Path=/; Max-Age=3600; SameSite=Strict;`,
        },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: `Database error: ${err.message}` }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
