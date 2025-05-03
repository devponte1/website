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
  const [searchQuery, setSearchQuery] = useState('');

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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const encodedQuery = encodeURIComponent(searchQuery.trim());
      router.push(`/search/users?keyword=${encodedQuery}`);
      setSearchQuery(''); // clear input after search
    }
  };

  const hideHeader = pathname === '/login' || pathname === '/signup';
  if (hideHeader) return null;

  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px'
    }}>
      {/* Left side: optional (Logo or Home link) */}
      <Link href="/" style={{ marginRight: '20px' }}>Home</Link>

      {/* Center: Search Bar */}
      <form onSubmit={handleSearch} style={{ flexGrow: 1, textAlign: 'center' }}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search users..."
          style={{ width: '50%', padding: '5px' }}
        />
      </form>

      {/* Right side: Login / Logout */}
      <div style={{ marginLeft: '20px' }}>
        {isLoggedIn ? (
          <>
            <span style={{ marginRight: '10px' }}>Logged in as {username}</span>
            <button onClick={handleLogout}>Log Out</button>
          </>
        ) : (
          <>
            <Link href="/login" style={{ marginRight: '10px' }}>Login</Link>
            <Link href="/signup">Sign Up</Link>
          </>
        )}
      </div>
    </header>
  );
}
