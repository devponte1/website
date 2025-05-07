// app/signup/page.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('creating account...');

    // Call signup API
    const res = await fetch(`https://website.loca.lt/api/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
      credentials: 'include',  // Important for cookies to be sent
    });

    const data = await res.json();

    if (res.ok) {
      setStatus('account created! logging you in...');

      // Here you do NOT need to call login explicitly. The cookie from the signup API should log you in.

      // Optionally check if the token is stored
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");

      if (token) {
        setStatus('account created & logged in! redirecting...');
        router.push('/');
      } else {
        setStatus('account created, but login failed. Please log in manually and please contact The Dev.');
      }
    } else {
      setStatus(data.error || 'Error creating account');
    }
  }

  return (
    <div>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">create account</button>
      </form>
      <p>{status}</p>
    </div>
  );
}
