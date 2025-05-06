// app/components/ProfileButton.js
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

export default function ProfileButton() {
  const router = useRouter();
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const tokenCookie = document.cookie.split('; ').find(row => row.startsWith('token='));
    if (tokenCookie) {
      try {
        const token = decodeURIComponent(tokenCookie.split('=')[1]);
        const decodedToken = jwtDecode(token);
        setUsername(decodedToken.username);
      } catch (err) {
        console.error('Invalid token:', err);
        setUsername(null);
      }
    } else {
      setUsername(null);
    }
  }, []);

  if (!username) return null; // Don't show button if not logged in

  return (
    <button
      onClick={() => router.push(`/users/${username}`)}
    >
      my profile
    </button>
  );
}
