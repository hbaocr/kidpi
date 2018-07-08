const { spawn } = require('child_process');
var fs = require('fs');
//rec -q mattpiece.wav sinc 120-2k silence 1 0.1 5% 1 .1 100% : newfile : restart 
const child = spawn('rec', "-q mattpiece.wav sinc 120-2k silence 1 0.1 5% 1 .1 100% : newfile : restart ".split(" "));

// use child.stdout.setEncoding('utf8'); if you want text chunks
child.stdout.on('data', (chunk) => {
  // data from standard output is here as buffers
  console.log("Out: " + chunk);
});

child.stderr.on('data', (chunk) => {
  // data from standard output is here as buffers
  console.log("Err chunk: ", " " + chunk);
});

child.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});


fs.watch('.', {}, (eventType, filename) => {
  if (filename) {
    console.log("Something changed on: ", filename);
    if (filename.match(/matt.*wav/)) {
      console.log("Name matched.");
      fs.access("./" + filename, fs.constants.F_OK, (err) => {
        if (!err) {
          console.log("Got a new bark sound.");
          fs.unlink("./" + filename);
        }
      })
    }
  }
});
