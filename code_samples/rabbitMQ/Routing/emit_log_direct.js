const amqp = require('amqplib');

(async () => {
    const conn = await amqp.connect('amqp://guest:guest@localhost:5672');
    const channel = await conn.createChannel();
    const exchange = 'direct_logs';
    const args = process.argv.slice(2);
    const msg = args.slice(1).join(' ') || 'Hello World!';
    const severity = (args.length > 0) ? args[0] : 'info';
    await channel.assertExchange(exchange, 'direct', { durable: false });
    channel.publish(exchange, severity, Buffer.from(msg));
    console.log(" [x] Sent %s: '%s'", severity, msg);
    setTimeout(() => conn.close(), 500);
})();