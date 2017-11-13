var Gpio = require('pigpio').Gpio,
    motor = new Gpio(18, {mode: Gpio.OUTPUT});

var SerialPort = require('serialport');
var port = new SerialPort('/dev/ttyAMA0', {
  baudRate: 19200
});

const motors = {
  front: 0x02,
  back: 0x04,
}

const direction = {
  forward: 0x00,
  backward: 0x01,
}

var A1 = new Gpio(21, {mode: Gpio.OUTPUT});
var A2 = new Gpio(16, {mode: Gpio.OUTPUT});

var enable = new Gpio(26, {mode: Gpio.OUTPUT});
enable.digitalWrite(1);

function turnRight(howFar) {
  console.log("Turning right: ", howFar);
  enable.digitalWrite(1);
  A1.digitalWrite(1);
  A2.digitalWrite(0);
  if (howFar < 100) {
    howFar = 100;
  } else if (howFar > 255) {
    howFar = 255
  }
  motor.pwmWrite(howFar);
}

var rightTimer = null;
function rightMoment() {
  clearTimeout(rightTimer);
  turnRight(255);
  rightTimer = setTimeout(() => {
    goStraight(0);
  }, 300);
}

function turnLeft(howFar) {
  console.log("Turning left: ", howFar);
  enable.digitalWrite(1);
  A1.digitalWrite(0);
  A2.digitalWrite(1);
  if (howFar < 100) {
    howFar = 100;
  } else if (howFar > 255) {
    howFar = 255
  }
  motor.pwmWrite(howFar);
}

var leftTimer = null;
function leftMoment() {
  clearTimeout(leftTimer);
  turnLeft(255);
  leftTimer = setTimeout(() => {
    goStraight(0);
  }, 300);
}

function goStraight() {
  console.log("Not turning! ");
  enable.digitalWrite(0);
}

function fullStop() {
  var command = motors.front;
  console.log("Stop.", command);
  port.write(new Buffer([0x80, 0, command, 0]), function(err, results) {});
  command = motors.back;
  console.log("Stop.", command);
  port.write(new Buffer([0x80, 0, command, 0]), function(err, results) {});
}

function goForward(speed) {
  var command = direction.forward | motors.front;
  console.log("Going forward.", command, speed);
  port.write(new Buffer([0x80, 0, command, speed]), function(err, results) {});
  command = direction.forward | motors.back;
  console.log("Going forward.", command, speed);
  port.write(new Buffer([0x80, 0, command, speed]), function(err, results) {});
}

let forwardTimer = null;
function forwardMoment() {
  clearTimeout(forwardTimer);
  goForward(127);
  forwardTimer = setTimeout(() => {
    goForward(0);
  }, 300);
}

function goBackward(speed) {
  var command = direction.backward | motors.front;
  console.log("Going backward.", command, speed);
  port.write(new Buffer([0x80, 0, command, speed]), function(err, results) {});
  command = direction.backward | motors.back;
  console.log("Going backward.", command, speed);
  port.write(new Buffer([0x80, 0, command, speed]), function(err, results) {});
}

let backwardTimer = null;
function backwardMoment() {
  clearTimeout(backwardTimer);
  goBackward(127);
  backwardTimer = setTimeout(() => {
    goBackward(0);
  }, 300);
}

port.on("open", () => {
 console.log('open');

 port.on('data', function(data) {
   console.log('data received: ' + data);
 });

  //80,2,2 - two motor mode, motors 2 and 3.
  console.log("Writting out data.");
  // both motor: 5 : 1,0,1
  // front motors: 7 : 1,1,1
  // front motor: 3:  0,1,1
  /*
  port.write(new Buffer([0x80, 0,5,0]), function(err, results) {
    console.log('err ' + err);
    console.log('results ' + results);
    console.log("Wrote something out!!!");
  });
  */
});

function main() {
  setInterval(() => {
    goForward(127);
    setTimeout(() => {
      fullStop();
    }, 3500)
    setTimeout(() => {
      goBackward(127);
      setTimeout(() => {
        fullStop();
      }, 3500)
    }, 4000);
  }, 8000);
  fullStop();
}

function turningRoutine() {
  setInterval(() => {
    turnRight(150);
    setTimeout(() => {
      goStraight();
      setTimeout(() => {
        turnLeft(150);
      }, 1000);
    }, 1000);
  }, 3500);
}

fullStop();
goStraight();

var express = require('express');
var app = express();
var http = require('http');
var httpServer = http.Server(app);
var sio = require('socket.io');
var fs = require('fs');
var bodyParser = require('body-parser');

var io = sio(httpServer);
httpServer.listen(80);

function handleSocket(socket) {
  socket.on('msg', (data) => {
    console.log(data);
    switch(data) {
      case 'f': forwardMoment(); break;
      case 'b': backwardMoment(); break;
      case 's': fullStop(); break;
      case 'r': rightMoment(); break;
      case 'l': leftMoment(); break;
    }
  });
}
io.on('connection', handleSocket);

app.use(express.static(__dirname + '/static/'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', function(req, res){
    res.sendfile('/static/index.html');
});
