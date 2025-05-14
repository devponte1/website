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

  try {
    // First, call the signup API to create the user
    const res = await fetch(`https://website.loca.lt/api/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
      credentials: 'include', // Important: allows sending/receiving cookies
    });

    let data = {};
    const text = await res.text();
    if (text) data = JSON.parse(text);

    if (res.ok) {
      setStatus('account created! logging in...');

      // After account creation, login the user by calling the login API
      const loginRes = await fetch(`https://website.loca.lt/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include', // Important: allows sending/receiving cookies
      });

      if (loginRes.ok) {
        setStatus('account created & logged in! redirecting...');
        router.push('/');
        router.refresh();        // <-- THIS TRIGGERS UI UPDATE
      } else {
        setStatus('auto-login failed. Please log in manually.');
      }
    } else {
      setStatus(data.error || 'Error creating account');
    }
  } catch (err) {
    setStatus('Network or server error: ' + err.message);
    console.error(err);
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
