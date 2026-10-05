const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();
app.use(cors());

const TARGET = process.env.TARGET_URL;

const CHECKS = [
  'strict-transport-security',
  'x-frame-options',
  'content-security-policy',
  'x-content-type-options',
  'referrer-policy',
  'permissions-policy'
];

app.get('/scan', async (req, res) => {
  if (!TARGET) return res.status(500).json({ error: 'TARGET_URL not set' });
  try {
    const response = await fetch(TARGET, { method: 'HEAD', timeout: 10000 });
    const headers = {};
    CHECKS.forEach(h => { headers[h] = response.headers.get(h) || null; });
    res.json({
      headers,
      server: response.headers.get('server'),
      timestamp: new Date().toISOString()
    });
  } catch (e) {
    res.status(500).json({ error: 'Scan failed' });
  }
});

app.get('/health', (req, res) => res.json({ status: 'running' }));

app.listen(process.env.PORT || 3000, () => console.log('Scanner running'));
