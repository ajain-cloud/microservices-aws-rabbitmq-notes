const express = require('express');
const rateLimit = require('express-rate-limit');
const app = express();

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 2, // Limit each IP to 2 requests per minute

    // message: 'Too many requests. Please try again after a minute.',
    // standardHeaders: true, // enables `RateLimit-*` headers
    // legacyHeaders: false,  // disables `X-RateLimit-*` headers

    // Send HTTP 429 response with custom headers and body
    // handler: (req, res) => {
    //     res.set('Retry-After', 60); // in seconds
    //     res.status(429).send(`
    //   <html>
    //     <head><title>429 Too Many Requests</title></head>
    //     <body>
    //       <h1>Too Many Requests</h1>
    //       <p>Please try again after 1 minute.</p>
    //     </body>
    //   </html>
    // `);
    // }

    // return JSON
    handler: (req, res) => {
        res.set('Retry-After', 60); // in seconds
        res.status(429).json({
            error: 'Too many requests',
            retryAfter: '60 seconds',
            message: 'Please wait and try again later.'
        });
    }
});

app.use(limiter);

app.get('/', async (req, res) => {
    res.send('Request successful');
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});