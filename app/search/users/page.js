// app/search/users/page.js (example usage)

'use client';

import { useState } from 'react';

export default function SearchUsersPage() {
  const [keyword, setKeyword] = useState('');
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSearch(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setUsers([]);

    try {
      const res = await fetch(`/api/search/users?keyword=${encodeURIComponent(keyword)}`);
      const data = await res.json();

      if (res.ok) {
        if (Array.isArray(data.users)) {
          setUsers(data.users);
        } else {
          setError('Invalid response format.');
        }
      } else {
        setError(data.error || 'API error occurred.');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search users..."
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {users.length > 0 ? (
        <ul>
          {users.map((user) => (
            <li key={user.id}>{user.username}</li>
          ))}
        </ul>
      ) : (
        !loading && <p>No users found.</p>
      )}
    </div>
  );
}
