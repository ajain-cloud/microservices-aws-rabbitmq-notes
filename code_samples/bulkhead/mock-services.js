const express = require('express');
const app = express();

app.get('/fast', (req, res) => {
    res.send('Fast Response 🚀');
});

app.get('/slow', (req, res) => {
    setTimeout(() => {
        res.send('Slow response 🐢');
    }, 3000);
});

app.listen(3001, () => console.log('Mock services running on http://localhost:3001'));