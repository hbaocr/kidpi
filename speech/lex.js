// lex.js 
var AWS = require('aws-sdk'),
 fs = require('fs'),
 ts = require('tailstream'),
 exec = require('child_process').exec;
 spawn = require('child_process').spawn;

var FULFILLED = 'Fulfilled',
 RESPONSE_FILE = 'response.mpeg',
 REMOVE_REQUEST_FILE = 'rm request.wav',
 SOX_COMMAND = 'sox',
 SOX_PARAMS = '-d -t wavpcm -c 1 -b 16 -r 16000 -e signed-integer --endian little request.wav silence 1 0 20% 5 0.3t 20%'.split(/ /);

var streaming = false,
 inputStream,
 lexruntime = new AWS.LexRuntime({
   region: 'us-east-1',
   credentials: new AWS.Credentials(
     "AKIAJVVFT5736BRJ376Q",
     "UyWTmMxQ37hds9DNOXHQR8vdYfshEGFvulzXDi8a", null)
 });

var setupStream = function() {
  streaming = true;
  inputStream = ts.createReadStream('./request.wav');
  var params = {
    botAlias: '$LATEST',
    botName: "BookTrip",
    userId: 'lexHeadTesting',
    contentType: 'audio/l16; rate=16000; channels=1',
    inputStream: inputStream
  };

  lexruntime.postContent(params, function(err, data) {
   if (err) {
     console.log(err, err.stack);
     throw(err);
   } else {
     console.log("Got a response audio file.", JSON.stringify(data));
     fs.writeFile(RESPONSE_FILE, data.audioStream, function(err) {
       if (err) {
         return console.log(err);
         process.exit(1);
       }
     });

     var playback = exec('/usr/bin/mpg123 ' + RESPONSE_FILE);
     playback.on('close', function(code) {
       console.log("Done playing file.",code);
       exec('rm ' + RESPONSE_FILE);
       if (data.dialogState !== FULFILLED) {
         streaming = false;
         record();
       }
     });
     playback.on('error',(err) => {console.log("error", err);});
   }
  });
}

var recording = null;
var record = function() {
  console.log("Command:", SOX_COMMAND, SOX_PARAMS);
  recording = spawn(SOX_COMMAND, SOX_PARAMS);
  recording.stdout.on('data', function(data) {
    console.log("STDOUT: ", data);
    if (!streaming) {
      setupStream();
    }
  });
  recording.stderr.on('data', function(data) {
    console.log("STDERR: ", data+"");
    if (!streaming) {
      setupStream();
    }
  });
  recording.on('close', function(code) {
    inputStream.done();
    exec(REMOVE_REQUEST_FILE);
  });
}
record();

process.on('uncaughtException', function (err) {
  console.log("Uncaught execption.", err);
  console.log("Killing, exiting.");
  recording.kill();
  process.exit(1);
})

process.on('exit', () => {
  recording.kill();
});
