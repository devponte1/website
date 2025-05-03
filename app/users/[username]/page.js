'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UserPage({ params }) {
  const [userData, setUserData] = useState(null);

  const { username } = params;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch(`https://website.loca.lt/api/users/${username}`);
        if (res.ok) {
          const data = await res.json();
          console.log(data); // Check the response for join_date
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

  // Check if join_date is null or empty and handle accordingly
  const joinDate = userData.join_date
    ? new Date(userData.join_date).toLocaleDateString()  // Format the date to "DD MM YYYY"
    : 'Unknown';  // Display 'Unknown' if join_date is null or empty

  return (
    <div>
      <h1>{userData.username}</h1>
      <p>Join Date: {joinDate}</p>
    </div>
  );
}
