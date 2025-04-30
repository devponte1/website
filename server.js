// server.js
const express = require('express');
const next = require('next');
const mysql = require('mysql2/promise');

const dev = process.env.NODE_ENV !== 'production'; // Check if in dev mode
const app = next({ dev });
const handle = app.getRequestHandler(); // Next.js default handler

app.prepare().then(() => {
  const server = express();

  // Custom API route
  server.get('/users', async (req, res) => {
    try {
      const db = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'yourPassword',
        database: 'websiteDatabase',
      });

      const [rows] = await db.query('SELECT id, username FROM users');
      res.json({ success: true, users: rows });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Handle all other requests via Next.js
  server.all('*', (req, res) => {
    return handle(req, res); // Pass the request to Next.js
  });

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});
