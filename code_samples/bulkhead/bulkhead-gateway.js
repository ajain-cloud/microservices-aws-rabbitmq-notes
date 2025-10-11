const express = require('express');
const axios = require('axios');
const Bottleneck = require('bottleneck');

const app = express();

const slowLimiter = new Bottleneck({
    maxConcurrent: 2, // Allow 2 slow requests in parallel
    minTime: 100, // (optional) small gap between calls,
    highWater: 0,         // No queued jobs allowed
    strategy: Bottleneck.strategy.OVERFLOW, // Drop anything beyond limit
    rejectOnDrop: true    // Actually reject dropped requests
});

// No limiter for fast endpoint (no bulkhead)
app.get('/fast', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:3001/fast');
        res.send(response.data);
    } catch (err) {
        res.status(500).send('Fast service failed');
    }
});

// Use bulkhead limiter on slow route
app.get('/slow', async (req, res) => {
    try {
        const result = await slowLimiter.schedule(() => {
            return axios.get('http://localhost:3001/slow');
        });

        res.send(result.data);
    } catch (err) {
        console.error('Limiter error:', err.message);
        res.status(503).send('Too many slow requests!');
    }
});

app.listen(3000, () => console.log('Bulkhead Gateway running on http://localhost:3000'));