/*
 * This will setup and configure hostapd, dnsmasq, and iptables 
 * specifically to get a Raspberry PI to work as a Wifi Router.
 *
 * This program assumes it will re-run repeatedly on boot.  It makes use 
 * of ephemeral settings and configurations.  It also takes down the host
 * interface at its start.
 * 
 * There is a sister systemd service file, that can be used to ensure
 * it comes up at start.
 *
 * Dependancies: dnsmasq hostapd iptables
 * Example: sudo apt-get install -y dnsmasq hostapd iptables
 * 
 * Assumptions: The PI has two interfaces.  Host that will be the
 * wifi part, and another interface that is the internet 
 * connection.  Make sure you have the pi connected to a decent 
 * power supply too.
 *
 * To run: 
 * npm install
 * sudo node index.js
 * 
 * To install into systemd (so that it starts every time the pi boots): 
 * sudo systemctl enable /home/pi/kidpi/apmagic/apmagic.service
 * sudo systemctl start apmagic.service
 * 
 */

var child_process = require('child_process');
var exec = child_process.exec;
var fs = require('fs');
var tmp = require('tmp');

const hostInterface = 'wlan0';  // The WiFi Access Device.
const gateInterface = 'eth0';  // The interface connected to the internet.

const APExecs = require('./apexecs.js');
const EventEmitter = require('events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

// This uses the temporary flag setting that is possible by writting to the pseudo file
// ip_forward.  There are more permanent ways.
function trafficForwarding(callback) {
  fs.open('/proc/sys/net/ipv4/ip_forward', 'w', (err, fd) => {
    if (err) throw err;

    fs.write(fd, '1');
    console.log('ip_forward flag written.');

    // Note, iptables does not like being blated with several rules instantaneously.
    // So I used the event emitter to organize them.
    APExecs.iptables(gateInterface, '-t nat -A POSTROUTING -j MASQUERADE', () => {myEmitter.emit('gatesetup')});

    // Takes care of forwarding the traffic from host to gate
    myEmitter.on('gatesetup', () => {
      APExecs.iptables(hostInterface, '-t nat -A FORWARD -i ' + gateInterface + ' -m state --start RELATED,ESTABLISHED -j ACCEPT');
      myEmitter.emit('forwardingSetup');
    });

    // Makes sure the responses coming to gate make it through to host
    myEmitter.on('forwardingSetup', () => {
      APExecs.iptables(gateInterface, '-A FORWARD -i ' + hostInterface + ' -j ACCEPT', callback);
    });
  });
}
  
// Coordinates all of the configurations.  Uses a combination of
// callbacks and events.  Events help you pop the stack on
// deep callback hell.
function createAccessPoint() {  

  APExecs.takeDown(hostInterface, (err) => {
    console.log("Trying to bring down " + hostInterface + ".  Err?", err);
    myEmitter.emit('down');
  });

  myEmitter.on('down', () => {
    APExecs.ifconfig(hostInterface, 'inet', '172.24.1.1', (err) => {
      console.log("Err setting the ip address?", err);
      APExecs.ifconfig(hostInterface, 'broadcast', '172.24.1.255', (err) => {
        console.log("Err setting the broadcast address?", err);
        APExecs.ifconfig(hostInterface, 'netmask', '255.255.255.0', (err) => {
          console.log("Err setting the mask address?", err);
          APExecs.ifconfig(hostInterface, 'network', '172.24.1.0', (err) => {
            console.log("Err setting the network?", err);
            myEmitter.emit('ipconfigured');
          });
        });
      });
    });
  });

  myEmitter.on('ipconfigured', () => {
    APExecs.hostapd({
        ssid: 'MattWuzHere',
        password: 'easypeazie'
      }, () => {
      console.log("Done setting up hostap.");
      APExecs.dnsmasq({}, () => {
        console.log("Done setting up dnsmasq.");
        APExecs.trafficForwarding(() => {
          console.log("Traffic forwarding setup.");
        });
      });
    });
  });
}

// Make sure everything in the network stack is settled
// before this program starts mucking with stuff.
console.log("Waiting 30 seconds while everything else comes up...");
setTimeout(createAccessPoint, 30000);

