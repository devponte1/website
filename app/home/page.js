// app/home/page.js

import ProfileButton from '../components/ProfileButton.js';

export default async function HomePage() {
  // Fetching all users
  const res = await fetch(`https://website.loca.lt/api/userlist`, {
    cache: 'no-store',
  });

  let users = [];
  let userlistFailed = false;

  if (res.ok) {
    const data = await res.json();
    users = data.users || [];
  } else {
    userlistFailed = true;
  }

  return (
    <div>
      <title>Home</title>

      <h1>Home</h1>
      <p>
        this is a website where you can create an account, discover users' profiles and more features are coming soon.
      </p>

      <ProfileButton />

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

      {userlistFailed && (
        <p>failed to load users - server might be offline</p>
      )}
    </div>
  );
}
