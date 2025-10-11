// Simulates a slow or failing service
const express = require('express');
const app = express();

app.get('/data', async (req, res) => {
    const delay = Math.floor(Math.random() * 5000);
    console.log('Delay:', delay);
    setTimeout(() => {
        if (Math.random() < 0.5) res.status(500).send('Service failed!');
        else res.send('Hello from slow-service');
    }, delay);
});

app.listen(3001, () => console.log('Slow service running on http://localhost:3001'));