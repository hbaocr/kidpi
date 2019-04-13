const { spawn } = require('child_process');
var fs = require('fs');
var child = null;
//const soundsDir = "/tmp/sounds";
const soundsDir = "/home/pi/kidpi/bark-detector/barks";
function startSpawn(recTuning) {
  // Start the soc recorder looking for barks...
  //rec -q mattpiece.wav sinc 1k-2k silence 1 0.1 5% 1 .1 100% : newfile : restart 
  var params
  if ( child != null ) {
    child.kill();
  }

  var recParams = ("-q " + soundsDir+ "/mattpiece" + Math.random() + ".wav sinc 200-2k silence 1 0.1 5% 1 .1 100% : newfile : restart ").split(" ");
    for(var i in recParams) {
      console.log(i + ": " +  recParams[i]);
    }
  /*
  recParams[4] = recParams.bottomFreq + "-" + recParams.topFreq;
  recParams[5] = recParams.numAbovePeriods;
  recParams[7] = recParams.abovePeriodDuration;
  */

  console.log("Recording: rec ", recParams.join(" "));
  child = spawn('rec', recParams);

  child.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
    child = null;
    setTimeout(startSpawn, 1000);
  });
}
startSpawn();

// Restart the recording tool every twenty minutes or so.
setInterval(() => {
  // Close the rec program. This will cause the "close" event.
  child.kill();
}, 1000 * 60 * 20);

// Make sure we reboot every 24 hours
function rebootComputer() {
  var rspawn = spawn('/sbin/shudown', "-r now".split(" "));
  console.log("Shutting down.");
  rspawn.on('close', function() {});
}
setTimeout(rebootComputer, 1000 * 60 * 60 * 24);

function startWork() {
  console.log("Starting work...");
  if (!fs.existsSync(soundsDir)){
    fs.mkdirSync(soundsDir);
  }
  fs.watch(soundsDir, {}, (eventType, filename) => {
    if (filename) {
      console.log("Something changed on: ", filename);
      if (filename.match(/matt.*wav/)) {
        console.log("Name matched.");
        fs.access(soundsDir + "/" + filename, fs.constants.F_OK, (err) => {
          if (!err) {
            console.log("Got a new bark sound.");
            fs.unlink(soundsDir + "/" + filename, ()=>{});
            gpio.write(waterPin, true, (err) => {
              if (err) {
                console.log("Error in setting gpio pin.",err);
                return;
              } else {
                console.log("Pin on.");
              }

              setTimeout(() => {
                gpio.write(waterPin, false, (err) => {
                  if (err) {
                    console.log("Error in setting gpio pin.",err);
                    return;
                  } else {
                    console.log("Pin off.");
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
