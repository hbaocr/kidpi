var net = require('net');
var http = require('http');

var client = net.createConnection("/var/run/lirc/lircd");
///var/run/lirc/lircd

client.on("connect", function() {
  /*
  console.log("Button pressed in JS:" + process.argv[2]);
  client.write(process.argv[2]);
  client.end();
  */
});

client.on("data", function(data) {
  if ((data+"").match(/.* \d+.*/)) {
    var dataStr = (data + "").replace(/(.*) \d+.*(\r|\n)+/m,"$1");
    console.log("Key:", dataStr);
    try { 
      switch(dataStr) {
        default:
        case "000040040d00606d": 
          http.get('http://192.168.1.33/pause', (res) => { res.on('error', () => {}); })
          .on('error', function(e) {});
          console.log("Paused.");
          break;
        case "000040040d00202d":
          http.get('http://192.168.1.33/back', (res) => { res.on('error', () => {}); })
          .on('error', function(e) {});
          console.log("Back.");
          break;
      }
    } catch(ex) {}
  }
});
