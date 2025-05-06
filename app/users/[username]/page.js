'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';  // Import useRouter from next/navigation
import { notFound } from 'next/navigation';  // Import notFound from next/navigation
import Head from 'next/head';

export default function UserPage({ params }) {
  const [userData, setUserData] = useState(null);
  const [username, setUsername] = useState(null);
  const router = useRouter();  // Initialize the router

  useEffect(() => {
    const fetchUsername = async () => {
      const unwrappedParams = await params;  // Unwrap the Promise
      if (unwrappedParams && unwrappedParams.username && !username) {
        setUsername(unwrappedParams.username); // Set the username state
      }
    };

    fetchUsername();
  }, [params, username]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (username) {
        try {
          const res = await fetch(`https://website.loca.lt/api/users/${username}`);
          if (res.ok) {
            const data = await res.json();
            console.log("Fetched User Data:", data); // Log the whole response
            setUserData(data);
          } else {
            console.log('User not found');
            notFound();
          }
        } catch (err) {
          console.error('Error fetching user data', err);
          router.push('/not-found');  // Redirect to the default 404 page if there’s an error
        }
      }
    };

    if (username) {
      fetchUserData(); // Fetch user data once username is set
    }
  }, [username, router]); // Add router to dependencies to avoid stale closures

  if (!userData) {
    return <div>loading...</div>;
  }

  // Debug: Log the joinDate directly to check its value
  console.log("join date:", userData.joinDate); // Corrected field name

  // Check if joinDate is valid, else handle accordingly
  let joinDate = 'not set'; // Default if joinDate is missing

  if (userData.joinDate) {
    const parsedDate = new Date(userData.joinDate); // Corrected field name
    console.log("Parsed Date:", parsedDate); // Log parsed date to check format
    // If the parsed date is valid, format it
    if (!isNaN(parsedDate)) {
      joinDate = parsedDate.toLocaleDateString(); // Format the date to "DD MM YYYY"
    }
  }

  return (
    <div>
      <h1>{userData.username}</h1>
      <p>Join Date: {joinDate}</p>
    </div>
  );
}
