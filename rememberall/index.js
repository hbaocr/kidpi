const { spawn } = require('child_process');
var fs = require('fs');
var request = require('request');
var Twilio = require('twilio');

var accountSid = process.env.TWILIO_ACCOUNT_SID;
var token = process.env.TWILIO_AUTH_TOKEN;

var twilio = Twilio(accountSid, token);
var root = "./images";

var child = null;
function startSpawn() {
  // Start the soc recorder looking for barks...
  var params = "--width 640 --height 480 -t 1 -n -o "+root+"/image" + (new Date().getTime()) + ".jpg";
  console.log("Params: "+params);
  child = spawn('raspistill', params.split(" "));

  child.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
    //setTimeout(startSpawn, 1000);
  });
}
startSpawn();

function cleanFile(filename) {
  fs.unlink("./" + filename);
}

function startWork() {
  console.log("Starting work...");
  fs.watch(root, {}, (eventType, filename) => {
    if (filename) {
      //console.log("Something changed on: ", filename);
      if (filename.match(/image.*jpg$/)) {
        console.log("Name matched.");
        fs.access(root + "/" + filename, fs.constants.F_OK, (err) => {
          if (!err) {
            console.log("Got a new image.");
            sendPicture(filename, (results) => {
              console.log("Picture result.", results);
              if (found && found != "") {
                sendSMS(results);
              }
              startSpawn();
            });
          } else {
          }
        });
      }
    }
  });
  startSpawn();
}

startWork();

function sendPicture(filename, cb) {
  console.log("Posting image: ", filename);
  var r = request.post('http://ec2-54-201-207-77.us-west-2.compute.amazonaws.com/compare', function gobots(err, httpRes, body) {
    console.log("Sent. Err?", err);
    var results = JSON.parse(body)
    var found = ""
    console.log("Body:", found);
    if (results.findResults) {
      found = results.findResults;
      if (found && found.FaceMatches) {
        found = found.FaceMatches;
        faces = [];
        for (var face in found) {
          console.log("Face: ", face, found[face].Face.ExternalImageId);
          faces.push(found[face].Face.ExternalImageId);
        }
        found = faces;
      }
    }
    if (cb) {
      cb(found);
    }
  });

  var form = r.form();
  form.append('guid','4taBjfJ-8');
  form.append('uploadfile', fs.createReadStream(root + '/' + filename), {
      filename: filename
  });
}

var from = process.env.FROM_NUMBER;
var to = process.env.TO_NUMBER;

// Send message using callback
function sendSMS(body) {
  twilio.messages.create({
    from: from,
    to: to,
    body: body
  }, function(err, result) {
    console.log('Created message using callback');
    console.log(result.sid);
  });
}


function exitHandler(ex) {
  console.log("Whoops:", ex);
  child.kill();
}

//catches uncaught exceptions
process.on('uncaughtException', exitHandler);
