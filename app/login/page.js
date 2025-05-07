'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('logging in...');

    const res = await fetch(`https://website.loca.lt/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    console.log('Response from backend:', data);

    if (res.ok && data.token) {
      console.log('Storing token:', data.token);
      localStorage.setItem('token', data.token); // store token safely

      setStatus('logged in!');
      setTimeout(() => {
        router.push('/');
      }, 1000);
    } else {
      console.error('Login failed:', data.error);
      setStatus(data.error || 'Error logging in');
    }
  }

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">log in</button>
      </form>
      <p>{status}</p>
    </div>
  );
}
