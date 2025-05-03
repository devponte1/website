'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UserPage({ params }) {
  const [userData, setUserData] = useState(null);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (params.username) {
          setUsername(params.username);
          const res = await fetch(`https://website.loca.lt/api/users/${params.username}`);
          if (res.ok) {
            const data = await res.json();
            console.log(data); // Check the response for join_date
            setUserData(data);
          } else {
            console.error('User not found');
          }
        }
      } catch (err) {
        console.error('Error fetching user data', err);
      }
    };

    // Using React.use() to unwrap params
    if (params && params.username) {
      fetchUserData();
    }
  }, [params]); // Add params as a dependency

  if (!userData) {
    return <div>Loading...</div>;
  }

  // Check if join_date is valid, else handle accordingly
  let joinDate = 'Unknown'; // Default if join_date is missing

  if (userData.join_date) {
    const parsedDate = new Date(userData.join_date);
    // If the parsed date is valid, format it
    if (!isNaN(parsedDate)) {
      joinDate = parsedDate.toLocaleDateString(); // Format the date to "DD MM YYYY"
    }
  }

  return (
    <div>
      <h1>{userData.username}</h1>
      <p>Join Date: {joinDate}</p>
    </div>
  );
}
