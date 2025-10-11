const amqp = require('amqplib');

(async () => {
    const conn = await amqp.connect('amqp://guest:guest@localhost:5672');
    const channel = await conn.createChannel();
    const msg = process.argv.slice(2).join(' ') || "Hello World!";
    const exchange = 'logs';
    await channel.assertExchange(exchange, 'fanout', { durable: false });
    channel.publish(exchange, '', Buffer.from(msg));
    console.log(" [x] Sent %s", msg);
    setTimeout(() => conn.close(), 500);
})();