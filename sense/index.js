"use strict";
const sense = require("sense-hat-led");
const Color = require('color');
const https = require('https');

var step = 0;
var direction = 1;
var min = 50;
var currentAction = 0;
var currentData = {r: 0, g: 0, b: 0, steptime: 10, stepsize: 10};
var cancelCurrent = false; // Mutex to ensure there isn't a race condition.

function stepColor(step) {
  var change = direction * currentData.stepsize;
  step += change;

  if (step >= 100) {
    direction = -1;
    step = 100;
  }

  if (step <= min) {
    direction = 1;
    step = min;
  }

  var color = new Color({r:Number(currentData.r),g:Number(currentData.g),b:Number(currentData.b)});
  color = color.darken(step/100);
  var ob = color.rgb().round().object();
  cancelCurrent = false;
  sense.clear([Math.floor(ob.r),Math.floor(ob.g),Math.floor(ob.b)], (err) => {
    if (cancelCurrent) {
      cancelCurrent = false;
    } else {
      setTimeout(() => {
        stepColor(step);
      }, currentData.steptime);
    }
  });
}

function pulseColor(r,g,b) {
  sense.clear([r,g,b]);
  stepColor(0, r, g, b);
}

pulseColor(0, 0, 255);

setInterval(() => {
  https.get('https://theamackers.com/toyota/all', (res) => {
    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', (chunk) => { rawData += chunk; });
    res.on('end', () => {                                                                                               
      try {
        const parsedData = JSON.parse(rawData);
        console.log("Received: ", rawData);
        var updated = false;
        for (var prop in parsedData) {
          if (!currentData[prop] || parsedData[prop] != currentData[prop]) {
            currentData[prop] = parsedData[prop];
          }
        }
      } catch (e) {
        console.error(e.message);
      }
    });
    res.on('error', (err) => {
      console.log(err, err.stack);
    });
  }).on('error', (err) => {
    console.log(err, err.stack);
  });
}, 3000);

