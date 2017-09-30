// Connect to server
var io = require('socket.io-client')
var socket = io.connect('theamackers.com', {reconnect: true});
var player = require('play-sound')(opts = {})

function playChime() {
  player.play("/home/pi/kidpi/audio/alert.mp3");
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
});

socket.on('audiomsg', function(dataString) {
  playChime();
});



