require('dotenv').config();
const express = require('express');
const path = require('path');

// node-fetch ESM workaround
const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html at the root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route: Search perfumes by brand
app.get('/api/perfumes', async (req, res) => {
  const brand = req.query.q;
  const url = `https://${process.env.RAPIDAPI_HOST}/perfumes/search?q=${encodeURIComponent(brand)}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY,
        'x-rapidapi-host': process.env.RAPIDAPI_HOST,
      },
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Error fetching perfumes:', err);
    res.status(500).json({ error: 'API request failed' });
  }
});

// Route: Get dupes by perfume ID
app.get('/api/dupes/:id', async (req, res) => {
  const id = req.params.id;
  const url = `https://${process.env.RAPIDAPI_HOST}/dupes/${id}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY,
        'x-rapidapi-host': process.env.RAPIDAPI_HOST,
      },
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Error fetching dupes:', err);
    res.status(500).json({ error: 'API request failed' });
  }
});

// ✅ Route: Match perfumes based on selected notes
app.get('/api/match', async (req, res) => {
  const notes = req.query.notes;
  if (!notes) {
    return res.status(400).json({ error: 'Missing notes parameter' });
  }

  const url = `https://${process.env.RAPIDAPI_HOST}/perfumes/search?q=${encodeURIComponent(notes)}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY,
        'x-rapidapi-host': process.env.RAPIDAPI_HOST,
      },
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Error fetching match data:', err);
    res.status(500).json({ error: 'API request failed' });
  }
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is running at http://0.0.0.0:${PORT}`);
});
