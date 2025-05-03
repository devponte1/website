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

  // Format join date to show only DD-MM-YYYY
  const joinDate = userData.join_date
    ? new Date(userData.join_date).toLocaleDateString('en-GB') // en-GB format will be DD/MM/YYYY
    : 'Unknown';

  return (
    <div>
      <h1>{userData.username}</h1>
      <p>Join Date: {joinDate}</p>
    </div>
  );
}
