const amqp = require('amqplib');

(async () => {
    const conn = await amqp.connect('amqp://guest:guest@localhost:5672');
    const channel = await conn.createChannel();
    const msg = process.argv.slice(2).join(' ') || "Hello World!";
    const queue = 'task_queue';
    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(msg), { persistent: true });
    console.log(" [x] Sent %s", msg);
    setTimeout(() => conn.close(), 500);
})();