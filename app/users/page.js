// app/users/page.js

export default async function UsersPage() {
  // Use the correct environment variable for the backend URL
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users`, { cache: 'no-store' });
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
