// sudo apt-get install libasound2-dev
var spawn = require('child_process').spawn
var io = require('socket.io-client')
var socket = io.connect('https://theamackers.com', {reconnect: true});
var ss = require('socket.io-stream');
var EventEmitter = require('events');

socket.on("hi", () => {
  console.log("Server said hi.");
  startPiping();
});


class RecordProcess extends EventEmitter {
  constructor(pipe) {
    super();
    let args =  [
      '-f', 'alsa',
      '-i', 'plughw:1,0',
      '-channels','1', 
      '-af', 'highpass=f=200, lowpass=f=3000',
      '-ab', '8k',
      '-ac', '1',
      '-f', 'webm',
      '-'
    ]
    console.log("Spawning: ffmpeg", args.join(" "));
    this.process = spawn('ffmpeg', args);
    this.process.stdout.pipe(pipe);
    /*
    this.process.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
    });
    */


    this.process.once('exit', (code) => {
      console.log("Record process ended.", code);
      this.emit("exit");
    });
  }
}

class AplayProcess extends EventEmitter {
  constructor(pipe) {
    super();
    let args =  [
      '-nodisp',
      '-'
    ]
    console.log("Spawning: ffplay", args.join(" "));
    this.process = spawn('ffplay', args);
    pipe.pipe(this.process.stdin);

    this.process.once('exit', (code) => {
      console.log("Play process ended.", code);
      this.emit("exit");
    });
  }
}

function createRecPipe(pipe) {
  let rec = new RecordProcess(pipe);
  rec.on("exit", () => {
    createRecPipe(pipe);
  });
}

function createPlayPipe(pipe) {
  let play = new AplayProcess(pipe);
  play.on("exit", () => {
    createPlayPipe(pipe);
  });
}

function startPiping() {
  ss(socket).on("party-audio", (stream) => {
    console.log("Got an audio stream...");
    createPlayPipe(stream);
  });

  console.log("Piping.");
  let outStream = ss.createStream();
  createRecPipe(outStream);

  ss(socket).emit("audio-stream", outStream, {name: "mamacker"});
  console.log("Started piping...");
}

