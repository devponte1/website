'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation'; // Use the search params hook
import { Suspense } from 'react'; // Import Suspense for async boundaries

// Component that handles the search logic
function SearchComponent() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get('keyword'); // Get the keyword from the search params

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (keyword) {
      // Start loading when the keyword is available
      const fetchData = async () => {
        try {
          const res = await fetch(`/api/search/users?keyword=${encodeURIComponent(keyword)}`);
          const data = await res.json();
          setUsers(data.users); // Set the users returned by the API
        } catch (error) {
          console.error("Error fetching users:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [keyword]); // Re-run when the keyword changes

  if (loading) {
    return <div>Loading users...</div>; // Display loading message while fetching
  }

  if (!users.length) {
    return <div>No users found for "{keyword}"</div>; // If no users are found
  }

  return (
    <div>
      <h1>Search Results for: "{keyword}"</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.username}</li>
        ))}
      </ul>
    </div>
  );
}

// Main page component wrapped in Suspense
export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading search results...</div>}>
      <SearchComponent /> {/* Render the SearchComponent */}
    </Suspense>
  );
}
