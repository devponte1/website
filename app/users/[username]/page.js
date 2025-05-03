// app/users/[username]/page.js

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UserPage({ params }) {
  const [userData, setUserData] = useState(null);

  // Unwrap params using React.use() (experimental warning compliance)
  const { username } = params;  // For now, this is still allowed (warning only)

  useEffect(() => {
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
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{userData.username}</h1>
      <p>Join Date: {userData.joinDate}</p>
    </div>
  );
}
