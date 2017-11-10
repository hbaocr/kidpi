const record = require('node-record-lpcm16');
const Detector = require('snowboy').Detector;
const Models = require('snowboy').Models;

const models = new Models();

models.add({
  file: 'Robot.pmdl',
  sensitivity: '0.5',
  hotwords : 'robot'
});

const detector = new Detector({
  resource: "node_modules/snowboy/resources/common.res",
  models: models,
  audioGain: 2.0
});

detector.on('silence', function () {
  console.log('silence');
});

detector.on('sound', function (buffer) { // Buffer arguments contains sound that triggered the event, for example, it could be written to a wav stream 
  console.log('sound');
});

detector.on('error', function () {
  console.log('error');
});

detector.on('hotword', function (index, hotword, buffer) { // Buffer arguments contains sound that triggered the event, for example, it could be written to a wav stream 
  console.log('hotword', index, hotword);
});

const mic = record.start({
  threshold: 0,
  verbose: true
});

mic.pipe(detector);
