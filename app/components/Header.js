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
  const [isServerOffline, setIsServerOffline] = useState(false);

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

  const checkServer = async () => {
    try {
      const response = await fetch('/api/ping', { cache: 'no-store' });
      if (!response.ok) throw new Error('Server error');
      setIsServerOffline(false);
    } catch (err) {
      setIsServerOffline(true);
    }
  };

  useEffect(() => {
    checkAuth();
    checkServer();

    const interval = setInterval(() => {
      checkAuth();
      checkServer();
    }, 5000); // every 5 seconds

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
      setSearchQuery('');
    }
  };

  const hideHeader = pathname === '/login' || pathname === '/signup';
  if (hideHeader) return null;

  return (
    <>
      {isServerOffline && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: 'orange',
          color: 'white',
          textAlign: 'center',
          padding: '5px',
          zIndex: 1100
        }}>
          ⚠️ the server is offline.
        </div>
      )}

      <header style={{
        position: 'fixed',
        top: isServerOffline ? '30px' : '0',
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '5px 15px',
        backgroundColor: '#fff',
        borderBottom: '1px solid #ccc',
        zIndex: 1000
      }}>
        {/* Left side: Home link */}
        <Link href="/" style={{ textDecoration: 'none', fontWeight: 'bold' }}>Home</Link>

        {/* Center: Search Bar */}
        <form onSubmit={handleSearch} style={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users..."
            style={{
              width: '30%',
              padding: '4px 8px',
              fontSize: '14px',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
          />
        </form>

        {/* Right side: Auth buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {isLoggedIn ? (
            <>
              <span style={{ fontSize: '14px' }}>Logged in as <strong>{username}</strong></span>
              <button onClick={handleLogout} style={{
                padding: '4px 8px',
                fontSize: '14px',
                cursor: 'pointer'
              }}>Log Out</button>
            </>
          ) : (
            <>
              <Link href="/login" style={{ textDecoration: 'none', fontSize: '14px' }}>Login</Link>
              <Link href="/signup" style={{ textDecoration: 'none', fontSize: '14px' }}>Sign Up</Link>
            </>
          )}
        </div>
      </header>
    </>
  );
}
