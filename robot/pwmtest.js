var Gpio = require('pigpio').Gpio,
led = new Gpio(18, {mode: Gpio.OUTPUT}),
dutyCycle = 0;

setInterval(function () {
  led.pwmWrite(dutyCycle);

  dutyCycle += 5;
  if (dutyCycle > 255) {
    dutyCycle = 0;
  }
}, 1000);
