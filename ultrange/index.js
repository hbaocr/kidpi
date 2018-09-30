var Gpio = require('onoff').Gpio;

var sendingPin = new Gpio(4, "out");
var receivingPin = new Gpio(20, "in", "both");

function getTime() {
  var hrTime = process.hrtime();
  return hrTime[0] * 1000000 + hrTime[1] / 1000;
}

var lastCall = 0;
function pinWatch(err, value) {
  if (err) { console.log("Error:", err); throw err; }
  console.log("Sender: ", value, "- ", getTime() - lastCall);
  lastCall = getTime();
}

receivingPin.watch(pinWatch);



setInterval(() => {
  console.log("Pinging...");
  sendingPin.unwatchAll();
  sendingPin.setDirection("out");
  sendingPin.write(1, () => {
    lastCall = getTime();
    setTimeout(() => {
      sendingPin.write(0, () => {
      /*
        console.log("Watching...");
        sendingPin.setDirection("in", "both");
        sendingPin.watch(pinWatch);
      */
      });
    },1);
  });
}, 1000);


process.on('SIGINT', () => {
  sendingPin.unexport();
  //receivingPin.unexport();
});
