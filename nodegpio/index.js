var gpio = require('rpi-gpio');
gpio.setMode(gpio.MODE_BCM);

var lampPin = 21;
function pinBlink() {
 gpio.write(lampPin, false, (err) => {
   if (err) {
     console.log("Error in setting gpio pin.",err);
     return;
   }
 
   setTimeout(() => {
     gpio.write(lampPin, true, (err) => {
       if (err) {
         console.log("Error in setting gpio pin.",err);
         return;
       }
     });
   }, 1000);
 });
}

gpio.setup(lampPin, gpio.DIR_OUT, () => {
 setInterval(pinBlink, 2000);
});
