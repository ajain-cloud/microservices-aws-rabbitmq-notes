const amqp = require('amqplib');

(async () => {
    const args = process.argv.slice(2);

    if (args.length == 0) {
        console.log("Usage: receive_logs_direct.js [info] [warning] [error]");
        process.exit(1);
    }

    const conn = await amqp.connect('amqp://guest:guest@localhost:5672');
    const channel = await conn.createChannel();
    const exchange = 'direct_logs';
    channel.assertExchange(exchange, 'direct', { durable: false });
    const q = await channel.assertQueue('', { exclusive: true });
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);

    args.forEach((severity) => {
        channel.bindQueue(q.queue, exchange, severity);
    });

    await channel.consume(q.queue, (msg) => {
        console.log(" [x] %s: '%s'", msg.fields.routingKey, msg.content.toString());
    }, {
        noAck: true // Auto-acknowledgment
    });
})();