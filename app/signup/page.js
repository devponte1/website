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
    setStatus('Creating account...');

    const res = await fetch(`website.loca.lt/api/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (res.ok) {
      if (!data.token) {
        setStatus('Account created but no token returned');
        return;
      }

      // Store token in cookies
      document.cookie = `token=${data.token}; Path=/; Max-Age=3600; SameSite=Strict;`;

      setStatus('Account created! Redirecting...');
      router.push('/'); // Redirect to homepage
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
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Create Account</button>
      </form>
      <p>{status}</p>
    </div>
  );
}
