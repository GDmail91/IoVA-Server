/**
 * Created by YS on 2016-10-31.
 */
var express = require('express');
var app = express();
var amqpconn;
var q = 'tasks';
function bail(err) {
    console.error(err);
    process.exit(1);
}
// Publisher
function publisher(conn) {
    conn.createChannel(on_open);
    function on_open(err, ch) {
        if (err != null) bail(err);
        ch.assertQueue(q, {durable:true}, function(err, _ok){
            ch.sendToQueue(q, new Buffer('{"ok":101010, "method":"get"}'));
        });
    }
}
require('amqplib/callback_api').connect('amqp://52.78.207.12', function(err, conn) {
    if (err != null) bail(err);
    amqpconn = conn;
});
app.get('/push', function (req, res) {
    publisher(amqpconn);
    res.send('push ok!');
});
var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port)
});