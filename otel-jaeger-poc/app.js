require('./tracing');

const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.send('Hello From OpenTelemetry');
});

app.get('/slow', async (req, res) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    res.send('This was a slow route');
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});