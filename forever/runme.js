#! /usr/bin/nodejs
var child_process = require('child_process');
var ping = require ("net-ping");
var https = require ("https");
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
  
  try {
    https.get('https://theamackers.com/storeip', (res) => {
      console.log("Stored ip address.");
    });
  } catch (ex) {
    console.log(ex);
  }

},10000);

