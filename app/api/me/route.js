// app/api/me/route.js
import { parse } from 'cookie';
import jwt from 'jsonwebtoken';
import { corsAndCookie, getOrigin } from '@/lib/corsAndCookie';

export async function GET(req) {
  const origin = getOrigin(req);
  const cookie = req.headers.get('cookie') || '';
  const { token } = parse(cookie);

  if (!token) {
    return new Response(JSON.stringify({ error: 'Not logged in' }), {
      status: 401,
      headers: {
        ...corsAndCookie({ origin }),
        'Content-Type': 'application/json',
      },
    });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    return new Response(JSON.stringify({ user }), {
      status: 200,
      headers: {
        ...corsAndCookie({ origin }),
        'Content-Type': 'application/json',
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Invalid token' }), {
      status: 401,
      headers: {
        ...corsAndCookie({ origin }),
        'Content-Type': 'application/json',
      },
    });
  }
}
