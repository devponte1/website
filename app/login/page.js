'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');  // Track status: success or error

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('logging in...');

    try {
      const res = await fetch(`https://website.loca.lt/api/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include', // Important: allows sending/receiving cookies
      });

      const text = await res.text();
      let data = {};
      if (text) data = JSON.parse(text);

      if (res.ok) {
        setStatus('logged in! redirecting...');
        
        // After login, check if we have a valid user session
        const meRes = await fetch(`https://website.loca.lt/api/me`, {
          credentials: 'include', // Include cookies to check the user session
        });

        if (meRes.ok) {
          setStatus('logged in! redirecting...');
          router.push('/');
        } else {
          setStatus('auto-login failed. Please log in again.');
        }
      } else {
        setStatus(data.error || 'Invalid login credentials');
      }
    } catch (err) {
      setStatus('Network or server error: ' + err.message);
      console.error(err);
    }
  }

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Log in</button>
      </form>
      <p>{status}</p>  {/* Display status messages */}
    </div>
  );
}
