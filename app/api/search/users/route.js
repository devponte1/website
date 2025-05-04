import pool from '@/lib/db';  // Correct import for the connection pool

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
  const url = new URL(req.url);
  const keyword = url.searchParams.get('keyword');  // ✅ Extract keyword from query param

  // Prevent empty search query
  if (!keyword || keyword.trim() === '') {
    return new Response(
      JSON.stringify({ users: [] }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...(getOrigin(req) && { 'Access-Control-Allow-Origin': getOrigin(req) }), // Allow CORS if origin is valid
        },
      }
    );
  }

  const origin = getOrigin(req);

  try {
    const [users] = await pool.query('SELECT * FROM users WHERE username LIKE ?', [`%${keyword}%`]);

    return new Response(
      JSON.stringify({ users }),  // Always return users array (even if empty)
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...(origin && { 'Access-Control-Allow-Origin': origin }), // Allow CORS if origin is valid
        },
      }
    );
  } catch (err) {
    console.error("Database error:", err.message);  // Log the error to Vercel logs
    return new Response(
      JSON.stringify({ error: 'Server error: ' + err.message }),  // Include detailed error message
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
