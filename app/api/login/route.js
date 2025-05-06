import mysql from 'mysql2/promise';
import jwt from 'jsonwebtoken';

const allowedOrigins = [
  'https://website1-devponte1s-projects.vercel.app',
  'http://localhost:3000'
  // Add more domains here if needed
];

function getOrigin(req) {
  const origin = req.headers.get('origin');
  if (allowedOrigins.includes(origin)) {
    return origin;
  }
  return null;
}

export async function POST(req) {
  const { username, password } = await req.json();
  const origin = getOrigin(req);

  try {
    const db = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    });

    const [users] = await db.query('SELECT * FROM users WHERE username = ?', [username]);

    if (users.length === 0 || users[0].password !== password) {
      return new Response(JSON.stringify({ error: 'incorrect username or password. try again' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...(origin && { 'Access-Control-Allow-Origin': origin }),
        },
      });
    }

    const token = jwt.sign(
      { userId: users[0].id, username: users[0].username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return new Response(
      JSON.stringify({ success: true, token }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...(origin && { 'Access-Control-Allow-Origin': origin }),
        },
      }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...(origin && { 'Access-Control-Allow-Origin': origin }),
      },
    });
  }
}

// Handle preflight OPTIONS request
export async function OPTIONS(req) {
  const origin = getOrigin(req);

  return new Response(null, {
    status: 204,
    headers: {
      ...(origin && { 'Access-Control-Allow-Origin': origin }),
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
