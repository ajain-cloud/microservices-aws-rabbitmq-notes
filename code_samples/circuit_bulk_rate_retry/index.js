const express = require('express');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const CircuitBreaker = require('opossum');
const Bottleneck = require('bottleneck');

const app = express();

// ---- Implement Retry Logic ----
const retryCircuitBreaker = async (breaker, retries = 2, delay = 500) => {
    try {
        return await breaker.fire();
    } catch (err) {
        if (retries <= 0) throw err;
        await new Promise(resolve => setTimeout(resolve, delay));
        return retryCircuitBreaker(breaker, retries - 1, delay * 2); // exponential backoff
    }
};

// ----- Rate Limiter (per IP, 2 requests per 10 sec) -----
const limiter = rateLimit({
    windowMs: 10 * 1000,
    max: 2,
    message: 'Too many requests from this IP, try again later.'
});

app.use('/proxy', limiter);

// ----- Bulkhead limiter (max 2 concurrent calls, no queue) -----
const bulkHeadLimiter = new Bottleneck({
    maxConcurrent: 3,
    highWater: 0,
    strategy: Bottleneck.strategy.OVERFLOW,
    rejectOnDrop: true
});

// ----- Backend service call -----
// async function callSlowService() {
//     const response = await axios.get('http://localhost:3001/data');
//     return response.data;
// }

// ----- Backend service call -----
const callSlowService = () => {
    return bulkHeadLimiter.schedule(() => axios.get('http://localhost:3001/data'));
};

// ----- Circuit Breaker setup -----
const breakerOptions = {
    timeout: 3000,
    errorThresholdPercentage: 50,
    resetTimeout: 5000
};

const breaker = new CircuitBreaker(callSlowService, breakerOptions);

// Optional fallback
breaker.fallback(() => {
    console.warn('Returning fallback response');
    return '🚨 Fallback: Service is currently unavailable. Please try later.';
});

// Breaker event logs
breaker.on('open', () => console.log('🚨 Circuit OPEN'));
breaker.on('halfOpen', () => console.log('⚠️ Circuit HALF-OPEN'));
breaker.on('close', () => console.log('✅ Circuit CLOSED'));

// ----- Proxy Endpoint -----
app.get('/proxy', async (req, res) => {
    try {
        const data = await retryCircuitBreaker(breaker, 2, 1000);
        res.send(data.data || data);
    } catch (err) {
        console.error('Error:', err.message);
        res.status(503).send('Ultimate failure (CB + retries + fallback failed)');
    }
});

// ----- Mock slow service (run separately on port 3001) -----
app.listen(3000, () => {
    console.log('Gateway running on http://localhost:3000');
});