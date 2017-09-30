#! /usr/bin/nodejs
var child_process = require('child_process');
var ping = require ("net-ping");
var https = require ("https");
const dns = require('dns');
var gpio = require('rpi-gpio');
gpio.setMode(gpio.MODE_BCM);

console.log("#################################### I started!");

var lampPin = 21;
function pinBlink() {
 gpio.write(lampPin, true, (err) => {
   if (err) {
     console.log("Error in setting gpio pin.",err);
     return;
   }
 
   setTimeout(() => {
     gpio.write(lampPin, false, (err) => {
       if (err) {
         console.log("Error in setting gpio pin.",err);
         return;
       }
     });
   }, 200);
 });
}

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
	pinBlink();
      }
    });
  });
},10000);

gpio.setup(lampPin, gpio.DIR_OUT, () => {});
