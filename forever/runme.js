#! /usr/bin/nodejs
var child_process = require('child_process');
var ping = require ("net-ping");
const dns = require('dns');

console.log("#################################### I started!");

setInterval(function() {
  dns.lookup('google.com', (err, addresses, family) => {
    console.log('addresses:', addresses);
    var session = ping.createSession ();
    session.pingHost (addresses, function (error, target) {
      if (error)
        console.log ("google.com: " + error.toString ());
      else {
        console.log ("google.com: reachable.");
        var command = "/bin/systemd-notify --pid="+process.pid+" WATCHDOG=1";
        console.log("Calling in! USecs:" + process.env.WATCHDOG_USEC + " PID: " + process.env.WATCHDOG_PID);
        console.log(command);
        var args = [
          '--pid=' + process.pid,
          'WATCHDOG=1'
        ]
        child_process.execFile('/bin/systemd-notify', args);
        console.log (target + ": Alive");
      }
    });
  });
},10000);

var net = require('net');
var Hs100Api = require('hs100-api');
var last = true;

// This server listens on a Unix socket at /var/run/mysocket
var unixServer = net.createServer(function(client) {
  console.log("Received connection!");
  
  var client = new Hs100Api.Client();
  var lightplug = client.getPlug({host: '192.168.1.22'});
  var fanplug = client.getPlug({host: '192.168.1.23'});
  var mattplug = client.getPlug({host: '192.168.1.12'});
  
  last = !last;
  lightplug.setPowerState(last);
  mattplug.setPowerState(last);
});

unixServer.listen('/var/run/lirc/lircrun');
