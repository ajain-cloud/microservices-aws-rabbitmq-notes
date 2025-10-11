const amqp = require('amqplib');

(async () => {
    const args = process.argv.slice(2);

    if (args.length == 0) {
        console.log("Usage: rpc_client.js num");
        process.exit(1);
    }

    const conn = await amqp.connect('amqp://guest:guest@localhost:5672');
    const channel = await conn.createChannel();
    const q = await channel.assertQueue('', { exclusive: true });
    const correlationId = generateUuid();
    const num = parseInt(args[0]);
    console.log(' [x] Requesting fib(%d)', num, q.queue);

    await channel.consume(q.queue, (msg) => {
        if (msg.properties.correlationId == correlationId) {
            console.log(' [.] Got %s', msg.content.toString());
            setTimeout(function () {
                conn.close();
                process.exit(0)
            }, 500);
        }
    }, {
        noAck: true // Auto-acknowledgment
    });

    channel.sendToQueue('rpc_queue', Buffer.from(num.toString()), {
        correlationId: correlationId,
        replyTo: q.queue
    });
})();

function generateUuid() {
  return Math.random().toString() +
         Math.random().toString() +
         Math.random().toString();
}