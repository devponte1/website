// app/api/search/users/route.js

import pool from '@/lib/db';

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

export async function GET(req) {
  const origin = getOrigin(req);

  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get('keyword');

  if (!keyword) {
    return new Response(JSON.stringify({ error: 'Keyword is required' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        ...(origin && { 'Access-Control-Allow-Origin': origin }),
      },
    });
  }

  try {
    const db = await pool.getConnection();

    const [users] = await db.query(
      'SELECT username, join_date FROM users WHERE username LIKE ?',
      [`%${keyword}%`]
    );

    db.release();

    return new Response(JSON.stringify(users), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...(origin && { 'Access-Control-Allow-Origin': origin }),
      },
    });
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
