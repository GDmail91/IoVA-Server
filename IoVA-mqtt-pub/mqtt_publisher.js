/**
 * Created by YS on 2016-10-31.
 */
// MQTT module
const mqtt = require('mqtt');
const connection = mqtt.connect(require('../credentials').mqtt.host);
/*
const dangerModelGen = require('./danger_model');
var dangerModel = new dangerModelGen();
*/
const dangerModel = require('./danger_model');

var q = 'tasks';
function bail(err) {
    console.error(err);
    process.exit(1);
}
// Consumer
function consumer(conn) {
    var ok = conn.createChannel(on_open);
    function on_open(err, ch) {
        if (err != null) bail(err);
        ch.assertQueue(q, {durable: true}, function(err, _ok) {
            ch.consume(q, function(msg) {
                if (msg !== null) {
                    var parsedMsg = msg.content.toString();
                    parsedMsg = JSON.parse(parsedMsg);
                    if (typeof parsedMsg == 'object') {

                        console.log(parsedMsg);
                        // TODO MongoDB 작업
                        switch (parsedMsg.method) {
                            case "post":
                                saveDanger(parsedMsg)
                                    .then(function() {
                                        var obj = {title : "위험정보 object"};
                                        connection.publish("hello", obj.toString(), {qos:2});
                                        //connection.publish(parsedMsg.topic, obj, {qos:2});
                                    })
                                    .catch(function() {
                                        ch.ack(msg);
                                    });
                                break;
                            case "get":
                                getInfo(parsedMsg)
                                    .then(function(locations) {
                                        var obj = {title : "위험정보 object"};
                                        connection.publish("hello", locations.toString(), {qos:2});
                                    })
                                    .catch(function() {
                                        ch.ack(msg);
                                    });
                                break;
                        }
                    }
                    ch.ack(msg);
                }
            });
        });
    }
}

// 데이터 삽입
function saveDanger(parsedMsg) {
    return new Promise(function(resolved, rejected) {
        dangerModel.saveDangerInfo({
            user_id: 101010,
            drive_id: 5,
            lat: 50,
            lon: 40,
            act: "speeding"
        }, function(err, id) {
            if (err) {
                console.error(err);
                return rejected(err);
            }

            console.log(id);
            resolved();
        });
    });
}

// 위치정보로 요청
function getInfo(parsedMsg) {
    return new Promise(function(resolved, rejected) {
        dangerModel.getDistance({
            max : 10,
            lat : 50,
            lon : 40
        }, function(err, locations) {
            if (err) {
                console.error(err);
                return rejected(err);
            }

            console.log(locations);
            resolved(locations);
        });
    });
}

require('amqplib/callback_api')
    .connect(require('../credentials').rabbitmq.host, function(err, conn) {
        if (err != null) bail(err);
        consumer(conn);
    });