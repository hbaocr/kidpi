let mic = require('mic-stream');
let speaker = require('audio-speaker');
const { Writable } = require('stream');

const outStream = new Writable({
  write(chunk, encoding, callback) {
    console.log(chunk.toString());
    callback();
  }
});


https://stackoverflow.com/questions/24071561/how-to-send-binary-data-from-a-node-js-socket-io-server-to-a-browser-client
//mic().pipe(speaker());
mic().pipe(outStream);
