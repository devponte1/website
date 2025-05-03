// app/search/users/page.js

'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get('keyword') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResults() {
      setLoading(true);
      try {
        const res = await fetch(`https://website.loca.lt/api/search/users?keyword=${encodeURIComponent(keyword)}`);
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error('Failed to fetch search results:', err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }

    if (keyword.trim() !== '') {
      fetchResults();
    } else {
      setResults([]);
      setLoading(false);
    }
  }, [keyword]);

  return (
    <div>
      <h1>Search Results for "{keyword}"</h1>
      {loading ? (
        <p>Loading...</p>
      ) : results.length === 0 ? (
        <p>No matching users found.</p>
      ) : (
        <ul>
          {results.map((user) => (
            <li key={user.username}>
              <Link href={`/users/${user.username}`}>
                {user.username} (Joined: {user.join_date ? new Date(user.join_date).toLocaleDateString() : 'Unknown'})
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
