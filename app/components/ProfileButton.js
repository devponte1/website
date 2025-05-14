'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function ProfileButton() {
  const router = useRouter();
  const { username, isLoggedIn } = useAuth(); // no polling needed

  if (!isLoggedIn || !username) return null;

  return (
    <button onClick={() => router.push(`/users/${username}`)}>
      my profile
    </button>
  );
}
