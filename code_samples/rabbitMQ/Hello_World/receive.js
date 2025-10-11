const amqp = require('amqplib');

(async () => {
    const conn = await amqp.connect('amqp://guest:guest@localhost:5672');
    const channel = await conn.createChannel();
    const queue = 'hello';
    await channel.assertQueue(queue, { durable: false });
    console.log(" [*] Waiting for messages. To exit press CTRL+C");
    channel.consume(queue, msg => {
        if (msg !== null) {
            console.log(" [x] Received:", msg.content.toString());
            channel.ack(msg);
        }
    });
})();