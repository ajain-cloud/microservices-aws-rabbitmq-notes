const express = require('express');
const app = express();

app.get('/data', (req, res) => {
    setTimeout(() => {
        const val = Math.random();
        console.log('Val:', val);
        if (val < 0.75) res.status(500).send('Random failure');
        else res.send('Slow response');
    }, 2000);
});

app.listen(3001, () => console.log('Slow service running on http://localhost:3001'));