// app/layout.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import jwt_decode from 'jwt-decode';

export default function Layout({ children }) {
  const router = useRouter();
  const [username, setUsername] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if there's a token in cookies
    const token = document.cookie.split('; ').find(row => row.startsWith('token='));
    if (token) {
      const decodedToken = jwt_decode(token.split('=')[1]);
      setUsername(decodedToken.username);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    // Clear the token cookie and redirect to login page
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
