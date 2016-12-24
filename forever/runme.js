#! /usr/bin/nodejs
var child_process = require('child_process');

console.log("#################################### I started!");
setInterval(function() {
  console.log("I'm alive!!! " + process.pid)
},1000)

setInterval(function() {
  var command = "/bin/systemd-notify --pid="+process.pid+" WATCHDOG=1";
  console.log("Calling in! USecs:" + process.env.WATCHDOG_USEC + " PID: " + process.env.WATCHDOG_PID);
  console.log(command);
  var args = [
    '--pid=' + process.pid,
    'WATCHDOG=1'
  ]
  child_process.execFile('/bin/systemd-notify', args);
},3000);
