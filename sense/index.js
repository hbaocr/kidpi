"use strict";
const sense = require("sense-hat-led");
const Color = require('color');

var step = 0;
var direction = 1;
var stepSize = 1;
var min = 50;
var stepTime = 5;

function stepColor(step, r, g, b) {
  var change = direction * stepSize;
  step += change;

  if (step >= 100) {
    direction = -1;
    step = 100;
  }

  if (step <= min) {
    direction = 1;
    step = min;
  }

  var color = new Color({r:r,g:g,b:b});
  color = color.darken(step/100);
  var ob = color.rgb().round().object();
  console.log("Step: ", step, " Color: ", ob);
  sense.clear([Math.floor(ob.r),Math.floor(ob.g),Math.floor(ob.b)], (err) => {
    currentAction = setTimeout(() => {
      stepColor(step, r,g,b);
    }, stepTime);
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
        var updated = false;
        for (prop in parsedData) {
          if (!currentData[prop] || parsedData[prop] != currentData[prop]) {
            currentData = parsedData;
            updated = true; 
            break;
          }
        }

        if (updated) {
          clearTimeout(currentAction);
          if (currentData.step) {
            stepSize = currentData.step;
          }
          if (currentData.stepTime) {
            stepTime = currentData.stepTime;
          }

          pulseColor(currentData.r, currentData.g, currentData.b);
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

