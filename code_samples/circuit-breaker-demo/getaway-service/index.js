const express = require('express');
const axios = require('axios');
const CircuitBreaker = require('opossum');

const app = express();

// Function to wrap with circuit breaker
async function fetchData() {
    const response = await axios.get('http://localhost:3001/data');
    return response.data;
}

// Circuit breaker options
const options = {
    timeout: 3000, // If call takes longer than 3s, fail
    errorThresholdPercentage: 50, // When 50% fail, open the breaker
    resetTimeout: 5000 // After 5s, try again
};

const breaker = new CircuitBreaker(fetchData, options);

breaker.on('open', () => console.log('Circuit is OPEN'));
breaker.on('halfOpen', () => console.log('Circuit is HALF-OPEN'));
breaker.on('close', () => console.log('Circuit is CLOSED'));
breaker.on('fallback', () => console.log('fallback called'));

// API endpoint
app.get('/proxy', async(req, res) => {
    try{
        const result = await breaker.fire();
        res.send(result);
    }catch(err){
        res.status(503).send('Service unavailable (via Circuit Breaker)');
    }
});

app.listen(3000, () => console.log('Gateway running on http://localhost:3000'));