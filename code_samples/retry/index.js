const express = require('express');
const axios = require('axios');

const app = express();

const retryWithBackoff = async (fn, retries = 2, delay = 500) => {
    try {
        return await fn();
    } catch (err) {
        console.log(`Retry after ${delay}ms due to: ${err.message}`);
        if (retries <= 0) {
            throw new Error(`Final failure after retries: ${err.message}`);
        }
        await new Promise(resolve => setTimeout(resolve, delay));
        return retryWithBackoff(fn, retries - 1, delay * 2);
    }
};

const callBackend = () => axios.get('http://localhost:3001/data');

app.get('/retry-test', async (req, res) => {
    try {
        const response = await retryWithBackoff(callBackend, 2, 1000);
        res.send(response.data);
    } catch (error) {
        console.error('Retry failed:', error.message);
        res.status(500).send('All retries failed');
    }
});

app.listen(3000, () => console.log('Retry test server running on http://localhost:3000'));