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

function corsHeaders(origin) {
  return {
    'Content-Type': 'application/json',
    ...(origin && { 'Access-Control-Allow-Origin': origin }),
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

export async function OPTIONS(req) {
  const origin = getOrigin(req);
  return new Response(null, {
    status: 204,
    headers: corsHeaders(origin),
  });
}

export async function GET(req) {
  const urlObj = new URL(req.url);
  const keyword = urlObj.searchParams.get('keyword') || '';

  const origin = getOrigin(req);

  try {
    const db = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    });

    const [users] = await db.query(
      'SELECT * FROM users WHERE username LIKE ?',
      [`%${keyword}%`]
    );

    await db.end();

    return new Response(JSON.stringify({ users }), {
      status: 200,
      headers: corsHeaders(origin),
    });
  } catch (err) {
    console.error('Database error:', err);

    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: corsHeaders(origin),
    });
  }
}
