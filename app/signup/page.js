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
      credentials: 'include',
    });

    const data = await res.json();

    if (res.ok) {
      if (!data.token) {
        setStatus('account created! logging you in...');
      } else {
        // In case your signup API also returns token (redundant safety)
        localStorage.setItem('token', data.token);
      }

      // Now auto login
      const loginRes = await fetch(`https://website.loca.lt/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      });

      const loginData = await loginRes.json();

      if (loginRes.ok && loginData.token) {
        localStorage.setItem('token', loginData.token);
        setStatus('Account created & Logged in! redirecting...');
        router.push('/');
      } else {
        setStatus('Account created, but auto-login failed. Please log in manually.');
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
