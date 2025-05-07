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
    const token = localStorage.getItem('token');
    if (token) {
      try {
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
    localStorage.removeItem('token');
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
    <header style={{
      position: 'fixed',
      top: 0,
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
      <Link href="/" style={{ textDecoration: 'none', fontWeight: 'bold' }}>home</Link>

      {/* Center: Search Bar */}
      <form onSubmit={handleSearch} style={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="search users"
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
            <span style={{ fontSize: '14px' }}>logged in as <strong>{username}</strong></span>
            <button onClick={handleLogout} style={{
              padding: '4px 8px',
              fontSize: '14px',
              cursor: 'pointer'
            }}>log out</button>
          </>
        ) : (
          <>
            <Link href="/login" style={{ textDecoration: 'none', fontSize: '14px' }}>log in</Link>
            <Link href="/signup" style={{ textDecoration: 'none', fontSize: '14px' }}>sign up</Link>
          </>
        )}
      </div>
    </header>
  );
}
