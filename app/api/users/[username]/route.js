// app/api/users/[username]/route.js

import mysql from 'mysql2/promise';

const allowedOrigins = [
  'https://website1-devponte1s-projects.vercel.app',
  // Add more domains here if needed
];

function getOrigin(req) {
  const origin = req.headers.get('origin');
  if (allowedOrigins.includes(origin)) {
    return origin;
  }
  return null;
}

export async function GET(req, context) {
  // Await params as the future-proof solution
  const params = await context.params;  // ✅ Await context.params to avoid warning
  const { username } = params;  // Now username will be available
  
  const origin = getOrigin(req);

  try {
    const db = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    });

    const [users] = await db.query('SELECT * FROM users WHERE username = ?', [username]);

    if (users.length === 0) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          ...(origin && { 'Access-Control-Allow-Origin': origin }), // Allow CORS if origin is valid
        },
      });
    }

    const user = users[0];
    return new Response(
      JSON.stringify({
        username: user.username,
        email: user.email, // Example additional data
        joinDate: user.join_date, // Example additional data
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...(origin && { 'Access-Control-Allow-Origin': origin }), // Allow CORS if origin is valid
        },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...(origin && { 'Access-Control-Allow-Origin': origin }), // Allow CORS if origin is valid
        },
      }
    );
  }
}
