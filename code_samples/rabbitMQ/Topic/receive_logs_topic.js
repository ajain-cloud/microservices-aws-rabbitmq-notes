const amqp = require('amqplib');

(async () => {
    const args = process.argv.slice(2);

    if (args.length == 0) {
        console.log("Usage: receive_logs_topic.js <facility>.<severity>");
        process.exit(1);
    }

    const conn = await amqp.connect('amqp://guest:guest@localhost:5672');
    const channel = await conn.createChannel();
    const exchange = 'topic_logs';
    channel.assertExchange(exchange, 'topic', { durable: false });
    const q = await channel.assertQueue('', { exclusive: true });
    console.log("[*] Waiting for logs. To exit press CTRL+C", q.queue);

    args.forEach((key) => {
        channel.bindQueue(q.queue, exchange, key);
    });

    await channel.consume(q.queue, (msg) => {
        console.log(" [x] %s: '%s'", msg.fields.routingKey, msg.content.toString());
    }, {
        noAck: true // Auto-acknowledgment
    });
})();