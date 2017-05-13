/*
 * This will setup and configure hostapd, dnsmasq, and iptables 
 * specifically to get a Raspberry PI to work as a Wifi Router.
 *
 * This program assumes it will re-run repeatedly on boot.  It makes use 
 * of ephemeral settings and configurations.  It also takes down wlan0
 * at its start.
 * 
 * There is a sister systemd service file, that can be used to ensure
 * it comes up at start.
 *
 * Dependancies: dnsmasq hostapd iptables
 * Example: sudo apt-get install -y dnsmasq hostapd iptables
 * 
 * Assumptions: The PI is plugged into a hardwired (eth0) internet 
 * connection, that allows it to be accessed even if the wifi is 
 * botched.  Make sure you have the pi connected to a decent 
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
    APExecs.iptables('eth0', '-t nat -A POSTROUTING -j MASQUERADE', () => {myEmitter.emit('eth0setup')});

    // Takes care of forwarding the traffic from wlan0 to eth0
    myEmitter.on('eth0setup', () => {
      APExecs.iptables('wlan0', '-t nat -A FORWARD -i eth0 -m state --start RELATED,ESTABLISHED -j ACCEPT');
      myEmitter.emit('forwardingSetup');
    });

    // Makes sure the responses coming to eth0 make it through to wlan0
    myEmitter.on('forwardingSetup', () => {
      APExecs.iptables('eth0', '-A FORWARD -i wlan0 -j ACCEPT', callback);
    });
  });
}
  
// Coordinates all of the configurations.  Uses a combination of
// callbacks and events.  Events help you pop the stack on
// deep callback hell.
function createAccessPoint() {  

  APExecs.takeDown('wlan0', (err) => {
    console.log("Trying to bring down wlan.  Err?", err);
    myEmitter.emit('down');
  });

  myEmitter.on('down', () => {
    APExecs.ifconfig('wlan0', 'inet', '172.24.1.1', (err) => {
      console.log("Err setting the ip address?", err);
      APExecs.ifconfig('wlan0', 'broadcast', '172.24.1.255', (err) => {
        console.log("Err setting the broadcast address?", err);
        APExecs.ifconfig('wlan0', 'netmask', '255.255.255.0', (err) => {
          console.log("Err setting the mask address?", err);
          myEmitter.emit('ipconfigured');
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


// First make sure we have the required SUDO access:
var uid = parseInt(process.env.SUDO_UID);
if (!uid) {
  throw new Error("Whoops!  This has to be run with SUDO access.");
}

// Make sure everything in the network stack is settled
// before this program starts mucking with stuff.
console.log("Waiting 30 seconds while everything else comes up...");
setTimeout(createAccessPoint, 30000);

