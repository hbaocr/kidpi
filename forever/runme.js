#! /usr/bin/nodejs
var child_process = require('child_process');

console.log("#################################### I started!");
setInterval(function() {
  console.log("I'm alive!!! " + process.pid)
},1000)

setInterval(function() {
  var command = "/bin/systemd-notify WATCHDOG=1";
  console.log("Calling in!");
  console.log(command);
  child_process.execFile(command);
},3000);
