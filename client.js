/**
 * Created by YS on 2016-10-25.
 */
var net = require('net');

function getConnection(connName){
  var client = net.connect({port: 8107, host:'127.0.0.1'}, function() {
    console.log(connName + ' Connected: ');
    console.log('   local = %s:%s', this.localAddress, this.localPort);
    console.log('   remote = %s:%s', this.remoteAddress, this.remotePort);

    this.setTimeout(10000);
    this.setEncoding('utf8');

    this.on('data', function(data) {
      console.log(connName + " From Server: " + data.toString());
      //this.end();
    });

    this.on('end', function() {
      console.log(connName + ' Client disconnected');
    });

    this.on('error', function(err) {
      console.log('Socket Error: ', JSON.stringify(err));
    });

    this.on('timeout', function() {
      console.log('Socket Timed Out');
    });

    this.on('close', function() {
      console.log('Socket Closed');
    });
  });
  return client;
}

/*function writeData(socket, data, callback){
  socket.write('test ');
  callback();
}*/

function writeData(socket, data, callback){
  var success = !socket.write(data);
  if (!success){
    (function(socket, data){
      socket.once('drain', function(){
        writeData(socket, data);
      });
    })(socket, data);
  }
  callback(success);
}

var Dwarves = getConnection("Dwarves");
//var Elves = getConnection("Elves");
//var Hobbits = getConnection("Hobbits");

writeData(Dwarves, "More Axes", function() {});
//writeData(Dwarves, "More Axes");
//writeData(Elves, "More Arrows");
//writeData(Hobbits, "More Pipe Weed");

/*
var writing = function(cb) {
  setTimeout(function() {
    cb();
  }, 1000);
}

writing();*/

var DriveInfo = require('./DriveInfo');
var Code = new DriveInfo();
Code.init("10201301010120", "00000001");
Code.setInfo({
  speed: "50", 
  front: "60", 
  back: "50", 
  lat: "12312312312", 
  lon: "12312312312"
});

require('async').series([function(cb) {
      setTimeout(function() {
        writeData(Dwarves, 
          Code.setReqId("000001"), 
          function(error) {
          console.log(error);
          if (error) return cb(error);
          cb(null);
        });
      }, 1000);
    }, function(cb) {
      setTimeout(function() {
        writeData(Dwarves, 
          Code.setReqId("000002"),
          function(error) {
          if (error) return cb(error);
          cb(null);
        });
      }, 1000);
    }, function(cb) {
      setTimeout(function() {
        writeData(Dwarves, 
          Code.setReqId("000003"), 
          function(error) {
          if (error) return cb(error);
          cb(null);
        });
      }, 1000);
    }, function(cb) {
      setTimeout(function() {
        writeData(Dwarves, 
          Code.setReqId("000004"), 
          function(error) {
          if (error) return cb(error);
          cb(null);
        });
      }, 1000);
    }], function(err, result) {
      if (!err){
          Dwarves.end();
        }
    });

