const { spawn } = require('child_process');
const FauxMo = require('fauxmojs');
const os = require('os');
const dns = require('dns');

let ipAddress = '';
dns.lookup(os.hostname()+".local", (e,a,f) => { console.log("IP address: ", a, "Errors: ", e); ipAddress = a; });

var fs = require('fs');
var child = null;
var isEnabled = true; // Holds the current state from alexa.

//const soundsDir = "/home/pi/kidpi/bark-detector/barks";
function startBrowser(recTuning) {
  // Start the soc recorder looking for barks...
  //rec -q mattpiece.wav sinc 1k-2k silence 1 0.1 5% 1 .1 100% : newfile : restart 
  var params
  if ( child != null ) {
    child.kill();
  }

  //DISPLAY=:0 
  process.env['DISPLAY'] = ':0';
  var chromeParams = ("--incognito --noerrdialogs --kiosk https://www.youtube.com/embed/9iGoDNlKY-g?list=tLppquNnqg8Yg2FLtBGI1pynHd_kTBfP9N&autoplay=1&loop=1").split(" ");
  console.log("Chrome: chromium-browser ", chromeParams.join(" "));
  child = spawn('chromium-browser', chromeParams);
}

// Make sure we reboot every 24 hours
function rebootComputer() {
  var rspawn = spawn('/sbin/shudown', "-r now".split(" "));
  console.log("Shutting down.");
  rspawn.on('close', function() {});
}
setTimeout(rebootComputer, 1000 * 60 * 60 * 24);

function startWork() {
  console.log("Registering Faux Alexa outlet...");
  let fauxMo = new FauxMo({
    ipAddress: ipAddress,
    devices: [{
        name: 'dog show',
        port: 11000,
        handler: (action) => {
          console.log('Show action:', action);
          if (action == "on") {
            startBrowser();
          } else {
            if ( child != null ) {
              child.kill();
            }
          }
        }
      },{
        name: 'dog tv',
        port: 11001,
        handler: (action) => {
          console.log('TV action:', action);
          toggleTVPower();
        }
      }
    ]
  });
}

function toggleTVPower() {
  gpio.write(tvPin, false, (err) => {
    if (err) {
      console.log("Error in setting gpio pin.",err);
      return;
    } else {
      console.log("Pin pressed.");
    }

    setTimeout(() => {
      gpio.write(tvPin, true, (err) => {
        if (err) {
          console.log("Error in setting gpio pin.",err);
          return;
        } else {
          console.log("Pin released.");
        }
      });
    }, 100);
  });
}

var gpio = require('rpi-gpio');
var tvPin = 37;
console.log("Setting up pin...");
gpio.setup(tvPin, gpio.DIR_OUT, (err) => {
  console.log("Done with setup...", err);
  startWork();
});


function exitHandler(ex) {
  console.log("Whoops:", ex);
  child.kill();
}

//catches uncaught exceptions
process.on('uncaughtException', exitHandler);
