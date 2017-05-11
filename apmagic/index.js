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

const EventEmitter = require('events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

// Simple function for using the command line for taking down an interface.
function takeDown(interface, callback) {
  exec('ifdown ' + interface, callback);
}

// Simplified function for making use of ifconfig command line tool.
//ifconfig -v wlan0 inet 172.24.1.1
//ifconfig -v wlan0 broadcast 172.24.1.255
function ifconfig(interface, addressType, address, callback) {
  exec('ifconfig ' + interface + " "+ addressType + " " + address, callback);
}

// Simplified interface to iptables.
function iptables(interface, flagString, callback) {
  var command = 'iptables -o ' + interface + " " + flagString;
  exec(command, callback);
}

// Function for making hostapd available to nodejs.  Has basic options
// for the AP, but also allows for pass-in configuration parameters.
function hostapd(options, callback) {
  var commands = [];

  // Known good options for the Raspberry PI 3.  If you are using the 
  // Raspberry PI Zero the driver value might need to be different.
  var defaultOptions = {
    driver:'nl80211', // <--- Make sure this is right for your hardware.
    channel:6,
    hw_mode:'g',
    interface:'wlan0',
    ssid:'MattWuzHere', // <--- This is going to be the name of the AP
    wpa:'2',
    wpa_passphrase:'easypeazie' // <--- This is going to be the AP's password.
  }

  const finalOptions = Object.assign(options, defaultOptions);
 
  Object.getOwnPropertyNames(finalOptions).forEach(function(key) {
    commands.push(key + '=' + options[key]);
  });

  // The tmp package does nice things for you, like creating a tmp file in the proper
  // location and making sure its deleted after the fact.  Hostapd really wants to
  // take its configurations as a file.  So we shove all the options into one and 
  // pass it along.
  tmp.file((err, path, fd) => {
    if (err) throw err;

    // In case you want to look at the config file:
    console.log('File: ', path);

    // We then write in the configurations...
    fs.write(fd, commands.join('\n'));

    console.log("Commands being executed: ", commands);

    // Then execute the hostapd with the file and boom - AP should be started.
    exec('hostapd ' + path);

    // Now that we are done - go ahead and let others know.
    if (callback) {
      callback();
    }
  });
}


// Simplified access to dnsmasq - the fellow responsible for handing out IP
// addresses to your wifi clients.  This can take commands as parameters
// but this function again takes advantage of the file configuration method.
function dnsmasq(options, callback) {
  var commands = [];
  var defaultOptions = {
    'interface':'wlan0',
    'listen-address':'172.24.1.1',
    'bind-interfaces':'',
    'server': '8.8.8.8', // <--- Google's DNS servers.  Very handy.
    'domain-needed':'',
    'bogus-priv':'',
    'dhcp-range':'172.24.1.50,172.24.1.150,12h'
  }

  const finalOptions = Object.assign(options, defaultOptions);

  Object.getOwnPropertyNames(finalOptions).forEach(function(key) {
    if (options[key] != '') {
      commands.push(key + '=' + options[key]);
    } else {
      commands.push(key);
    }
  });

  exec('/etc/init.d/dnsmasq stop', () => {
    tmp.file((err, path, fd) => {
      if (err) throw err;

      console.log('File: ', path);
      fs.write(fd, commands.join('\n'));

      console.log("Commands being executed: ", commands);
      exec('dnsmasq -C ' + path);
      if (callback) {
        callback();
      }
    });
  });
}

// This uses the temporary flag setting that is possible by writting to the pseudo file
// ip_forward.  There are more permanent ways.
function trafficForwarding(callback) {
  fs.open('/proc/sys/net/ipv4/ip_forward', 'w', (err, fd) => {
    if (err) throw err;

    fs.write(fd, '1');
    console.log('ip_forward flag written.');

    // Note, iptables does not like being blated with several rules instantaneously.
    // So I used the event emitter to organize them.
    iptables('eth0', '-t nat -A POSTROUTING -j MASQUERADE', () => {myEmitter.emit('eth0setup')});

    // Takes care of forwarding the traffic from wlan0 to eth0
    myEmitter.on('eth0setup', () => {
      iptables('wlan0', '-t nat -A FORWARD -i eth0 -m state --start RELATED,ESTABLISHED -j ACCEPT');
      myEmitter.emit('forwardingSetup');
    });

    // Makes sure the responses coming to eth0 make it through to wlan0
    myEmitter.on('forwardingSetup', () => {
      iptables('eth0', '-A FORWARD -i wlan0 -j ACCEPT', callback);
    });
  });
}
  
// Coordinates all of the configurations.  Uses a combination of
// callbacks and events.  Events help you pop the stack on
// deep callback hell.
function createAccessPoint() {  
  takeDown('wlan0', (err) => {
    console.log("Trying to bring down wlan.  Err?", err);
    myEmitter.emit('down');
  });

  myEmitter.on('down', () => {
    ifconfig('wlan0', 'inet', '172.24.1.1', (err) => {
      console.log("Err setting the ip address?", err);
      ifconfig('wlan0', 'broadcast', '172.24.1.255', (err) => {
        console.log("Err setting the broadcast address?", err);
        ifconfig('wlan0', 'netmask', '255.255.255.0', (err) => {
          console.log("Err setting the mask address?", err);
          myEmitter.emit('ipconfigured');
        });
      });
    });
  });

  myEmitter.on('ipconfigured', () => {
    hostapd({}, () => {
      console.log("Done setting up hostap.");
      dnsmasq({}, () => {
        console.log("Done setting up dnsmasq.");
        trafficForwarding(() => {
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

