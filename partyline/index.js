// sudo apt-get install libasound2-dev
var spawn = require('child_process').spawn
var io = require('socket.io-client')
var socket = io.connect('https://theamackers.com', {reconnect: true});
var ss = require('socket.io-stream');

socket.on("hi", () => {
  console.log("Server said hi.");
  startPiping();
});


class RecordProcess {
  constructor() {
    let args =  [
      '-c', '1', // 2 channels
      '-r', '44100', // 44100Hz sample rate
      '-f', 'S16_LE', // little endian 16 bit
      '--buffer-size=16384'
    ]
    console.log("Spawning: arecord ", args.join(" "));
    this.process = spawn('arecord', args);
    this.process.once('exit', (code) => {
      console.log("Record process ended.", code);
    });
  }
}

class AplayProcess {
  constructor() {
    let args =  [ ]
    console.log("Spawning: aplay ", args.join(" "));
    this.process = spawn('aplay', args);
    this.process.once('exit', (code) => {
      console.log("Play process ended.", code);
    });
  }
}

let rec = new RecordProcess().process.stdout;
let play = new AplayProcess().process.stdin;

function startPiping() {
  ss(socket).on("party-audio", (stream) => {
    console.log("Got an audio stream...");
    stream.pipe(play);
  });

  console.log("Piping.");

  let outStream = ss.createStream();
  rec.pipe(outStream);
  ss(socket).emit("audio-stream", outStream, {name: "mamacker"});
  console.log("Started piping...");
}

