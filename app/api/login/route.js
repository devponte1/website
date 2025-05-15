// app/api/login.route.js

import mysql from 'mysql2/promise';
import jwt from 'jsonwebtoken';
import { getOrigin, corsAndCookie, buildCookie } from '@/lib/corsAndCookie';

export async function OPTIONS(req) {
  const origin = getOrigin(req);
  return new Response(null, {
    status: 204,
    headers: corsAndCookie({ origin }),
  });
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
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 400,
        headers: {
          ...corsAndCookie({ origin }),
          'Content-Type': 'application/json',
        },
      });
    }

    const token = jwt.sign(
      { userId: users[0].id, username: users[0].username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    
  const cookieHeader = buildCookie(token, true); // 'true' for secure cookie

  console.log('Set-Cookie Header:', cookieHeader); //DEBUG

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        ...corsAndCookie({ origin, cookie: cookieHeader }),
        'Content-Type': 'application/json',
      },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: {
        ...corsAndCookie({ origin }),
        'Content-Type': 'application/json',
      },
    });
  }
}
