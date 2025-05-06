// app/page.js
export default async function HomePage() {
  // Fetching from the new userlist API endpoint
  const res = await fetch(`https://website.loca.lt/api/userlist`, {
    cache: 'no-store',
  });

  // Handle response correctly
  if (!res.ok) {
    return (
      <div>
        <h1>Home</h1> {/* Keep "Home" heading */}
        <p>failed to load users - server might be offile</p>
      </div>
    );
  }

  const data = await res.json();
  const users = data.users || [];

  return (
    <div>
      
      <title>Home</title>

      <h1>Home</h1>
      <h2>every user on this website</h2>
      <ul id="userboard">
        {users.length > 0 ? (
          users.map((u) => (
            <li key={u.id}>{u.username}</li>
          ))
        ) : (
          <p>No users found.</p>
        )}
      </ul>
    </div>
  );
}
