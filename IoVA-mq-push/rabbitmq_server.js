/**
 * Created by YS on 2016-11-01.
 */

var express = require('express');
var app = express();
var publisher = require('./rabbitmq_push');


app.get('/danger_location', function (req, res) {
    var obj = {
        method : req.method,
        lat : req.query.lat,
        lon : req.query.lon
    };

    publisher(amqpconn, req.method, obj);
    res.send('push ok!');
});

app.post('/danger_location', function (req, res) {
    var obj = {
        method : req.method,
        user_id: req.body.user_id,
        drive_id: req.body.drive_id,
        lat: req.body.lat,
        lon: req.body.lon,
        act: req.body.act
    };
    publisher(req.method, obj);
    res.send('push ok!');
});

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port)
});