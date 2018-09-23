const { spawn } = require('child_process');
var fs = require('fs');
var child = null;
function startSpawn() {
  // Start the soc recorder looking for barks...
  //rec -q mattpiece.wav sinc 120-2k silence 1 0.1 5% 1 .1 100% : newfile : restart 
  child = spawn('rec', "-q mattpiece.wav sinc 120-2k silence 1 0.1 5% 1 .1 100% : newfile : restart ".split(" "));

  child.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
    setTimeout(startSpawn, 1000);
  });
}
startSpawn();

// Make sure we reboot every 24 hours
function rebootComputer() {
  var rspawn = spawn('/sbin/shudown', "-r now".split(" "));
  console.log("Shutting down.");
  rspawn.on('close', function() {});
}
setTimeout(rebootComputer, 1000 * 60 * 60 * 24);

function startWork() {
  console.log("Starting work...");
  fs.watch('.', {}, (eventType, filename) => {
    if (filename) {
      console.log("Something changed on: ", filename);
      if (filename.match(/matt.*wav/)) {
        console.log("Name matched.");
        fs.access("./" + filename, fs.constants.F_OK, (err) => {
          if (!err) {
            console.log("Got a new bark sound.");
            fs.unlink("./" + filename);
            gpio.write(waterPin, true, (err) => {
              if (err) {
                console.log("Error in setting gpio pin.",err);
                return;
              }

              setTimeout(() => {
                gpio.write(waterPin, false, (err) => {
                  if (err) {
                    console.log("Error in setting gpio pin.",err);
                    return;
                  }
                });
              }, 1000);
            });
          }
        });
      }
    }
  });
}

var gpio = require('rpi-gpio');
var waterPin = 36;
console.log("Setting up pin...");
gpio.setup(waterPin, gpio.DIR_OUT, (err) => {
  console.log("Done with setup...", err);
  startWork();
});

function exitHandler(ex) {
  console.log("Whoops:", ex);
  child.kill();
}

//catches uncaught exceptions
process.on('uncaughtException', exitHandler);
