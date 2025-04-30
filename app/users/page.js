// app/users/page.js

export default async function UsersPage() {
  const res = await fetch('https://website.loca.lt/api/users', { cache: 'no-store' });
  const data = await res.json();

  return (
    <div>
      <h1>Users</h1>
      {data.success ? (
        <ul>
          {data.users.map((user) => (
            <li key={user.id}>
              {user.id} - {user.username}
            </li>
          ))}
        </ul>
      ) : (
        <p>Failed to load users.</p>
      )}
    </div>
  );
}
