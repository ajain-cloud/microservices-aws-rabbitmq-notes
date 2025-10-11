const amqp = require('amqplib');

(async () => {
    const conn = await amqp.connect('amqp://guest:guest@localhost:5672');
    const channel = await conn.createChannel();
    const exchange = 'logs';
    channel.assertExchange(exchange, 'fanout', { durable: false });
    const q = await channel.assertQueue('', { exclusive: true });
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);
    channel.bindQueue(q.queue, exchange, '');
    await channel.consume(q.queue, (msg) => {
        if (msg.content) {
            console.log(" [x] Received:", msg.content.toString());
        }
    }, {
        noAck: true // Auto-acknowledgment
    });
})();