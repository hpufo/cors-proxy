const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to enable CORS
app.use(cors());

// Proxy route to handle dynamic targets
app.use('/proxy', (req, res, next) => {
  const target = req.query.target; // Get the target URL from the query parameter
  if (!target) {
    return res.status(400).send('Missing "target" query parameter');
  }

  // Create a proxy middleware for the specific target
  const proxy = createProxyMiddleware({
    target, // Dynamic target
    changeOrigin: true, // Changes the origin of the request to the target URL
    pathRewrite: {
      '^/proxy': '', // Remove "/proxy" from the beginning of the path
    },
  });

  proxy(req, res, next); // Forward the request to the proxy
});

// Basic route to check server is running
app.get('/', (req, res) => {
  axios.get(req.query.target)
    .then((response) => {
      res.send(response.data);
    });
});

// Start the server
app.listen(PORT, () => {
  console.log(`CORS Proxy Server is running on http://localhost:${PORT}`);
});
