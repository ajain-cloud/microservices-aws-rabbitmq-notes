const amqp = require('amqplib');

(async () => {
    const conn = await amqp.connect('amqp://guest:guest@localhost:5672');
    const channel = await conn.createChannel();
    const exchange = 'topic_logs';
    const args = process.argv.slice(2);
    const msg = args.slice(1).join(' ') || 'Hello World!';
    const key = (args.length > 0) ? args[0] : 'anonymous.info';
    await channel.assertExchange(exchange, 'topic', { durable: false });
    channel.publish(exchange, key, Buffer.from(msg));
    console.log(" [x] Sent %s: '%s'", key, msg);
    setTimeout(() => conn.close(), 500);
})();