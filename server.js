/**
 * Created by YS on 2016-10-25.
 */
 var net = require('net');
 const driveInfo_model = require('./models/driveInfo_model');

var server = net.createServer(function(client) {
  console.log('Client connection: ');
  console.log('   local = %s:%s', client.localAddress, client.localPort);
  console.log('   remote = %s:%s', client.remoteAddress, client.remotePort);

  client.setTimeout(0);
  client.setEncoding('utf8');

  client.on('data', function(data) {
    console.log('Received data from client on port %d:',
                client.remotePort);
    console.log('  Bytes received: ' + client.bytesRead);
    // parsing
    var readMessage = data.toString();
    var DriveInfo = require('./DriveInfo');
    var driveInfo = new DriveInfo().initByString(readMessage);
    driveInfo_model.insert_driveInfo(driveInfo)
      .then(function(result) {
        console.log(result);
      })
      .catch(function(result) {
        console.log(result);
      })
    console.log(driveInfo);

    writeData(client, 'Sending: ' + data.toString());
    console.log('  Bytes sent: ' + client.bytesWritten);
  });

  client.on('end', function() {
    console.log('Client disconnected');
    server.getConnections(function(err, count){
      console.log('Remaining Connections: ' + count);
    });
  });

  client.on('error', function(err) {
    console.log('Socket Error: ', JSON.stringify(err));
  });

  client.on('timeout', function() {
    console.log('Socket Timed out');
  });
});

server.listen(8107, function() {
  console.log('Server listening: ' + JSON.stringify(server.address()));
  server.on('close', function(){
    console.log('Server Terminated');
  });

  server.on('error', function(err){
    console.log('Server Error: ', JSON.stringify(err));
  });
});

function writeData(socket, data){
  var success = !socket.write(data);
  if (!success){
    (function(socket, data){
      socket.once('drain', function(){
        writeData(socket, data);
      });
    })(socket, data);
  }
}