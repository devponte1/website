// app/api/logout/route.js
export async function POST() {
  return new Response(JSON.stringify({ message: 'Logged out' }), {
    status: 200,
    headers: {
      'Set-Cookie': 'token=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax',
      'Content-Type': 'application/json',
    },
  });
}
