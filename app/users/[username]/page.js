'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UserPage({ params }) {
  const [userData, setUserData] = useState(null);
  const { username } = params; // Get the username from the URL (e.g., /users/john)

  useEffect(() => {
    // Fetch user data based on the username (this could be from an API)
    const fetchUserData = async () => {
      try {
        const res = await fetch(`https://website.loca.lt/api/users/${username}`);
        if (res.ok) {
          const data = await res.json();
          setUserData(data);
        } else {
          console.error('User not found');
        }
      } catch (err) {
        console.error('Error fetching user data', err);
      }
    };

    fetchUserData();
  }, [username]);

  if (!userData) {
    return <div>Loading...</div>; // Show a loading state until the data is fetched
  }

  return (
    <div>
      <h1>{userData.username}</h1>
      <p>Email: {userData.email}</p>
      <p>Join Date: {userData.joinDate}</p>
      {/* Add more user information as needed */}
    </div>
  );
}
