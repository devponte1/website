// lib/corsAndCookie.js

const allowedOrigins = [
  'https://website1-devponte1s-projects.vercel.app',
  'http://localhost:3000',
];

// Determine if the request origin is allowed
export function getOrigin(req) {
  const origin = req.headers.get('origin');
  if (allowedOrigins.includes(origin)) {
    return origin;
  }
  return null;
}

// Generate CORS headers based on origin
export function getCorsHeaders(origin) {
  return {
    ...(origin && { 'Access-Control-Allow-Origin': origin }),
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Credentials': 'true',
  };
}

// Build a secure cookie for the JWT token
export function buildCookie(token, isSecure = true) {
  const parts = [
    `token=${token}`,
    'Path=/',
    'Max-Age=3600',
    'HttpOnly',
    'SameSite=None',
  ];
  if (isSecure) {
    parts.push('Secure');
  }
  return parts.join('; ');
}

// Optional helper to merge CORS and Set-Cookie headers
export function corsAndCookie({ origin, cookie }) {
  return {
    ...getCorsHeaders(origin),
    ...(cookie && { 'Set-Cookie': cookie }),
  };
}
