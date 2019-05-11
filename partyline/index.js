// sudo apt-get install libasound2-dev
var spawn = require('child_process').spawn
var io = require('socket.io-client')
var socket = io.connect('https://theamackers.com', {reconnect: true});
var ss = require('socket.io-stream');


socket.on("hi", () => {
  console.log("Server said hi.");
});


// Creates wrapper on record process.
class Microphone {
  constructor(onDone) {
    this.ready = false;
    this.rec = new RecordProcess(() => {
      this.ready = true;
      onDone();
    });

    this.stdout = this.rec.stdout;
  }

  pipe(toPipe) {
    console.log("Piping output through.");
    this.stdout.pipe(toPipe);
  }
}

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

//let mic = require('mic-stream');
let mic = new Microphone(() => {
  //https://stackoverflow.com/questions/24071561/how-to-send-binary-data-from-a-node-js-socket-io-server-to-a-browser-client
  //mic.pipe(speaker());
  let outStream = ss.createStream();
  ss(socket).emit("audio-stream", outStream);
  mic().pipe(outStream);
});
//

let speaker = require('audio-speaker');
let output = speaker();
ss(socket).on("audio-stream", (stream) => {
  stream.pipe(output);
});

