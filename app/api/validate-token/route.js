// app/api/validate-token/route.js

import mysql from 'mysql2/promise';
import jwt from 'jsonwebtoken';

const allowedOrigins = [
  'https://website1-devponte1s-projects.vercel.app',
  'http://localhost:3000',
];

function getOrigin(req) {
  const origin = req.headers.get('origin');
  if (allowedOrigins.includes(origin)) {
    return origin;
  }
  return null;
}

export async function POST(req) {
  const { token } = await req.json();
  const origin = getOrigin(req);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const db = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    });

    const [users] = await db.query('SELECT id FROM users WHERE id = ?', [userId]);

    const valid = users.length > 0;

    return new Response(JSON.stringify({ valid }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...(origin && { 'Access-Control-Allow-Origin': origin }),
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ valid: false }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...(origin && { 'Access-Control-Allow-Origin': origin }),
      },
    });
  }
}

// Optional — handle preflight OPTIONS if you ever make a POST with custom headers
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
