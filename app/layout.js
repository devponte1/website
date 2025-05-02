'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

export default function Layout({ children }) {
  const router = useRouter();
  const [username, setUsername] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = document.cookie.split('; ').find(row => row.startsWith('token='));
    if (token) {
      try {
        const decodedToken = jwtDecode(token.split('=')[1]);
        setUsername(decodedToken.username);
        setIsLoggedIn(true);
      } catch (err) {
        console.error('Invalid token:', err);
      }
    }
  }, []);

  const handleLogout = () => {
    document.cookie = 'token=; Max-Age=-1; Path=/;';
    setIsLoggedIn(false);
    setUsername(null);
    router.push('/login');
  };

  return (
    <div>
      <header>
        {isLoggedIn ? (
          <div>
            <p>Logged in as {username}</p>
            <button onClick={handleLogout}>Log Out</button>
          </div>
        ) : (
          <div>
            <a href="/login">Login</a> | <a href="/signup">Sign Up</a>
          </div>
        )}
      </header>

      <main>{children}</main>
    </div>
  );
}
