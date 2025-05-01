// app/page.js

export default async function HomePage() {
    const res = await fetch('https://website.loca.lt/users', {
      cache: 'no-store',
    });
    const data = await res.json();
    const users = data.users || [];
  
    return (
      <div>
        <h1>Home</h1>
        <a href="/signup">Sign Up</a>
  
        <h2>every user on this website</h2>
        <ul id="userboard">
          {users.map((u) => (
            <li key={u.id}>{u.username}</li>
          ))}
        </ul>
      </div>
    );
  }
  