'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { jwtDecode } from 'jwt-decode';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [username, setUsername] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkAuth = () => {
    const tokenCookie = document.cookie.split('; ').find(row => row.startsWith('token='));
    if (tokenCookie) {
      try {
        const token = decodeURIComponent(tokenCookie.split('=')[1]);
        const decodedToken = jwtDecode(token);
        setUsername(decodedToken.username);
        setIsLoggedIn(true);
      } catch (err) {
        console.error('Invalid token:', err);
        setIsLoggedIn(false);
        setUsername(null);
      }
    } else {
      setIsLoggedIn(false);
      setUsername(null);
    }
  };

  useEffect(() => {
    checkAuth();
    const interval = setInterval(checkAuth, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    document.cookie = 'token=; Max-Age=-1; Path=/;';
    setIsLoggedIn(false);
    setUsername(null);
    router.push('/');
  };

  
  const hideHeader = pathname === '/login' || pathname === '/signup';
  if (hideHeader) return null;

  return (
    <header style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px' }}>
      {isLoggedIn ? (
        <div>
          <p style={{ display: 'inline', marginRight: '10px' }}>Logged in as {username}</p>
          <button onClick={handleLogout}>Log Out</button>
        </div>
      ) : (
        <div>
          <Link href="/login" style={{ marginRight: '10px' }}>Login</Link>
          <Link href="/signup">Sign Up</Link>
        </div>
      )}
    </header>
  );
}
