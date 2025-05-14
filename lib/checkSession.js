export async function checkSession() {
  try {
    const res = await fetch('/api/me', { credentials: 'include' });
    if (!res.ok) return null;
    const user = await res.json();
    return user; // { userId, username }
  } catch (err) {
    return null;
  }
}
