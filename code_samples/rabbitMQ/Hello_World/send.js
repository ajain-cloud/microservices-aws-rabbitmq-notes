const amqp = require('amqplib');

(async () => {
    const conn = await amqp.connect('amqp://guest:guest@localhost:5672');
    const channel = await conn.createChannel();
    const msg = { text: "Hello from CloudAMQP!" };
    const queue = 'hello';
    await channel.assertQueue(queue, { durable: false });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)));
    console.log(" [x] Sent %s", msg.text);
    setTimeout(() => conn.close(), 500);
})();