var amqp = require('amqplib/callback_api');
var configs = require('../configs/rmq.json');

amqp.connect(configs.broker_uri, function(err, conn) {
    conn.createChannel(function(err, ch) {
        var ex = "semut.angkot";
        ch.assertExchange(ex, 'topic', {durable: false});
        ch.assertQueue('', {exclusive: true}, function(err, q) {
            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);
            ch.bindQueue(q.queue, ex, configs.broadcast_route);
            ch.consume(q.queue, function(msg) {
                console.log(" [x] %s", msg.content.toString());
            }, {noAck: true});
        });
    });

});