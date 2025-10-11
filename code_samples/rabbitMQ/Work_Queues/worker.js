const amqp = require('amqplib');

(async () => {
    const conn = await amqp.connect('amqp://guest:guest@localhost:5672');
    const channel = await conn.createChannel();
    const queue = 'task_queue';
    await channel.assertQueue(queue, { durable: true });
    channel.prefetch(1);
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
    channel.consume(queue, msg => {
        if (msg !== null) {
            var secs = msg.content.toString().split('.').length - 1;
            console.log(" [x] Received:", msg.content.toString());
            setTimeout(() => {
                console.log(" [x] Done");
            }, secs * 1000);
            channel.ack(msg);
        }
    });
})();