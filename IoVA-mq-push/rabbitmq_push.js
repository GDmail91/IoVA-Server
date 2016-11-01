/**
 * Created by YS on 2016-10-31.
 */
var amqpconn;
var q = 'tasks';
function bail(err) {
    console.error(err);
    process.exit(1);
}

require('amqplib/callback_api').connect('amqp://52.78.207.12', function(err, conn) {
    if (err != null) bail(err);
    amqpconn = conn;
});

// Publisher
exports.publisher = function (obj) {
    amqpconn.createChannel(on_open);
    function on_open(err, ch) {
        if (err != null) bail(err);
        ch.assertQueue(q, {durable:true}, function(err, _ok){
            ch.sendToQueue(q, new Buffer(obj.toString()));
        });
    }
};
