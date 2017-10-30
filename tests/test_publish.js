const amqp = require('amqplib/callback_api');
const broker_uri = require('../configs/rmq.json').broker_uri;
const exchangeName = require('../configs/rmq.json').exchange_name;
const routingKey = 'semut.angkot.service.update';

amqp.connect(broker_uri, function(err, conn) {
    conn.createChannel(function(err, ch) {
        ch.assertQueue('', {exclusive: true}, function(err, q) {
            let msg = {
                session_id : '2aa150879a87d26c1c4796e10be14259',
                latitude : -33.234,
                longitude : 23.9483,
                time : '15-08-2017 13:09:07',
                jumlah_penumpang : 9
            };
            msg = JSON.stringify(msg);
            ch.publish(exchangeName, routingKey, new Buffer(msg),
                {});
            console.log(" [x] Sent ");
        });
    });
});