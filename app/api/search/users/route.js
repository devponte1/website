// app/api/search/users/route.js
import mysql from 'mysql2/promise';

const allowedOrigins = [
  'https://website1-devponte1s-projects.vercel.app',
];

function getOrigin(req) {
  const origin = req.headers.get('origin');
  if (allowedOrigins.includes(origin)) {
    return origin;
  }
  return null;
}

export async function GET(req, context) {
  const urlObj = new URL(req.url);
  const keyword = urlObj.searchParams.get('keyword') || '';  // Always default to '' if null

  const origin = getOrigin(req);

  try {
    const db = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    });

    // Query users matching the keyword
    const [users] = await db.query(
      'SELECT * FROM users WHERE username LIKE ?',
      [`%${keyword}%`]
    );

    await db.end();  // Cleanly close connection

    return new Response(
      JSON.stringify({ users }), 
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...(origin && { 'Access-Control-Allow-Origin': origin }),
        },
      }
    );
  } catch (err) {
    console.error('Database error:', err);  // Log full error

    return new Response(
      JSON.stringify({ error: err.message }), 
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...(origin && { 'Access-Control-Allow-Origin': origin }),
        },
      }
    );
  }
}
