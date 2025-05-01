// app/page.js

export default async function HomePage() {
    // Fetching from the correct API endpoint
    const res = await fetch(`https://website.loca.lt/api/users`, {
      cache: 'no-store',
    });
  
    // Handle response correctly
    if (!res.ok) {
      return (
        <div>
          <h1>Error</h1>
          <p>Failed to load users data.</p>
        </div>
      );
    }
  
    const data = await res.json();
    const users = data.users || [];
  
    return (
      <div>
        <h1>Home</h1>
        <a href="/signup">Sign Up</a>
  
        <h2>Every user on this website</h2>
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
  