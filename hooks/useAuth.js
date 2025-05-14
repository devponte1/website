import { useEffect, useState } from 'react';

export function useAuth(poll = false) {
  const [username, setUsername] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  async function fetchMe() {
    try {
      const res = await fetch('/api/me', { credentials: 'include' });
      if (!res.ok) throw new Error('Not logged in');
      const data = await res.json();
      setUsername(data.user.username);
      setIsLoggedIn(true);
    } catch {
      setUsername(null);
      setIsLoggedIn(false);
    }
  }

  useEffect(() => {
    fetchMe();

    if (poll) {
      const interval = setInterval(fetchMe, 1000); // Poll every 1s
      return () => clearInterval(interval);
    }
  }, []);

  return { username, isLoggedIn };
}
