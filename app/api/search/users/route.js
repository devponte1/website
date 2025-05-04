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

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get('keyword');

  const origin = getOrigin(req);

  if (!keyword) {
    return new Response(JSON.stringify({ error: 'Missing keyword parameter' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        ...(origin && { 'Access-Control-Allow-Origin': origin }),
      },
    });
  }

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

    await db.end(); // always close connection

    return new Response(JSON.stringify({ users }), {
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
