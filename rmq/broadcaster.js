const userModel = require('../models/user_model');
const postModel = require('../models/post_model');
const configs = require('../configs/rmq.json');

/** broadcast lokasi angkot **/
broadcastAngkot = async(connection) => {
    try {
        let ch = await connection.createChannel();
        await ch.assertExchange(configs.exchange_name, 'topic', {durable: false});
        let q = await ch.assertQueue(configs.broadcast_queue_name, {exclusive: false, messageTtl: 1000});
        await ch.bindQueue(q.queue, configs.exchange_name, configs.broadcast_queue_name);
        console.log("starting broadcast via "+configs.broadcast_route);
        setInterval(async function () {
            let test = {test : "test"}.toString();
            let dataAngkot = await userModel.getAngkotLocation();
            let dataPost = await postModel.getPosts();
            let msg = {angkot : dataAngkot, laporan : dataPost};
            msg = JSON.stringify(msg);
            await ch.publish(configs.exchange_name, configs.broadcast_route, new Buffer(msg));
        }, 1500);
    }catch (err){
        console.log(err);
    }
};


module.exports = {
    broadcastAngkot:broadcastAngkot
};