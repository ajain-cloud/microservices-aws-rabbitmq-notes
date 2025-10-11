const amqp = require('amqplib');

(async () => {
    const conn = await amqp.connect('amqp://guest:guest@localhost:5672');
    const channel = await conn.createChannel();
    const queue = 'rpc_queue';
    await channel.assertQueue(queue, { durable: false });
    channel.prefetch(1);
    console.log(' [x] Awaiting RPC requests');
    channel.consume(queue, (msg) => {
        let n = parseInt(msg.content.toString());
        console.log(" [.] fib(%d)", n);
        let r = fibonacci(n);
        channel.sendToQueue(msg.properties.replyTo, Buffer.from(r.toString()), {
            correlationId: msg.properties.correlationId
        });

        channel.ack(msg);
    });
})();

function fibonacci(n) {
    if (n == 0 || n == 1)
        return n;
    else
        return fibonacci(n - 1) + fibonacci(n - 2);
}