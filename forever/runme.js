#! /usr/bin/nodejs
var child_process = require('child_process');

console.log("#################################### I started!");

setInterval(function() {
  var command = "/bin/systemd-notify --pid="+process.pid+" WATCHDOG=1";
  console.log("Calling in! USecs:" + process.env.WATCHDOG_USEC + " PID: " + process.env.WATCHDOG_PID);
  console.log(command);
  var args = [
    '--pid=' + process.pid,
    'WATCHDOG=1'
  ]
  child_process.execFile('/bin/systemd-notify', args);
  //child_process.execFile(command);
},10000);

var net = require('net');
var Hs100Api = require('hs100-api');
var last = true;

// This server listens on a Unix socket at /var/run/mysocket
var unixServer = net.createServer(function(client) {
  console.log("Received connection!");
  
  var client = new Hs100Api.Client();
  var lightplug = client.getPlug({host: '192.168.1.107'});
  var fanplug = client.getPlug({host: '192.168.1.177'});
  var mattplug = client.getPlug({host: '192.168.1.164'});
  
  last = !last;
  lightplug.setPowerState(last);
  mattplug.setPowerState(last);
});
unixServer.listen('/var/run/lirc/lircrun');
