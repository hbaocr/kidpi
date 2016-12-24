var net = require('net');

var client = net.createConnection("/var/run/lirc/lircrun");

client.on("connect", function() {
  console.log("Button pressed in JS:" + process.argv[2]);
  client.write(process.argv[2]);
  client.end();
});

client.on("data", function(data) {
});
