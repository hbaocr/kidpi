// Connect to server
var io = require('socket.io-client')
var socket = io.connect('theamackers.com', {reconnect: true});
var player = require('play-sound')(opts = {})

function playChime() {
  player.play("/home/pi/kidpi/audio/alert.mp3");
}

function playEmergency() {
  for (var i = 0; i < 5; i++) {
    setTimeout(() => {
      console.log("Playing alarm.");
      player.play("/home/pi/kidpi/audio/emergency.mp3");
    }, 3200 + (i * 8000))
  }
}

// Add a connect listener
socket.on('connect', function(socket) { 
  console.log('Connected!');
});

socket.on('hi', () => {
  console.log("The server said 'hi'!");
});

var peopleOnline = {};
socket.on('alive', function(data) {
  //data = ["mamacker", "cintar", "cintar2"];
  for ( var i = 0; i < data.length; i++) {
    // If someone other than us is online.  Keep track of that
    // and play an audio chime for anyone new.
    if (peopleOnline[data[i]] == null) {
      playChime();
      console.log("Newly online: " + data[i]);
    }

    var cleanIt = ((name) => {
      return () => {
        peopleOnline[name] = null;
      };
    })(data[i])

    if (peopleOnline[data[i]])
      clearTimeout(peopleOnline[data[i]].timeOut);

    peopleOnline[data[i]] = { 
      time: new Date().getTime(),
      timeOut: setTimeout(cleanIt, 30000)
    };
  }
});

socket.on('msg', function(dataString) {
  playChime();
  console.log("Msg received:", dataString);
  if (dataString.msg.match(/restart weasley/)) {
    const { spawn } = require('child_process');
    const child = spawn('reboot');
  }
});

socket.on('audiomsg', function(dataString) {
  playChime();
  console.log(dataString.src)
  var https = require('https');
  var fs = require('fs');

  var file = fs.createWriteStream(__dirname + "/file.wav");
  console.log("File location.: " + __dirname + "/file.wav");
  var request = https.get("https://theamackers.com" + dataString.src, function(response) {
      response.pipe(file);
      response.on("end", () => {
        setTimeout(() => {
          console.log("Audio file written.");
          const { spawn } = require('child_process');
          const child = spawn('aplay', [__dirname + "/file.wav"]);
          child.stderr.on('data', (data) => {
              console.log(`stderr: ${data}`);
          });
        }, 1000);
      });
  });
});

socket.on('emergency', function(dataString) {
  console.log("Received emergency alert.");
  playEmergency();
});



