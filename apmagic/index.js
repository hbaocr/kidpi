var child_process = require('child_process');
var exec = child_process.exec;
var fs = require('fs');
var tmp = require('tmp');

const EventEmitter = require('events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

function takeDown(interface, callback) {
  exec('ifdown ' + interface, callback);
}

//ifconfig -v wlan0 inet 172.24.1.1
//ifconfig -v wlan0 broadcast 172.24.1.255
function ifconfig(interface, addressType, address, callback) {
  exec('ifconfig ' + interface + " "+ addressType + " " + address, callback);
}

function iptables(interface, flagString, callback) {
  var command = 'iptables -o ' + interface + " " + flagString;
  exec(command, callback);
}

function hostapd(options, callback) {
  var commands = [];
  var defaultOptions = {
    driver:'nl80211',
    channel:6,
    hw_mode:'g',
    interface:'wlan0',
    ssid:'MattWuzHere',
    wpa:'2',
    wpa_passphrase:'easypeazie'
  }

  const finalOptions = Object.assign(options, defaultOptions);

  Object.getOwnPropertyNames(finalOptions).forEach(function(key) {
    commands.push(key + '=' + options[key]);
  });

  tmp.file((err, path, fd) => {
    if (err) throw err;

    console.log('File: ', path);
    fs.write(fd, commands.join('\n'));

    console.log("Commands being executed: ", commands);
    exec('hostapd ' + path);
    if (callback) {
      callback();
    }
  });
}

function dnsmasq(options, callback) {
  var commands = [];
  var defaultOptions = {
    'interface':'wlan0',
    'listen-address':'172.24.1.1',
    'bind-interfaces':'',
    'server': '8.8.8.8',
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

function trafficForwarding(callback) {
  fs.open('/proc/sys/net/ipv4/ip_forward', 'w', (err, fd) => {
    if (err) throw err;

    fs.write(fd, '1');
    console.log('ip_forward flag written.');

    // Note, iptables does not like being blated with several rules instantaneously.
    // So I used the event emitter to organize them.
    iptables('eth0', '-t nat -A POSTROUTING -j MASQUERADE', () => {myEmitter.emit('eth0setup')});

    myEmitter.on('eth0setup', () => {
      iptables('wlan0', '-t nat -A FORWARD -i eth0 -m state --start RELATED,ESTABLISHED -j ACCEPT');
      myEmitter.emit('forwardingSetup');
    });

    myEmitter.on('forwardingSetup', () => {
      iptables('eth0', '-A FORWARD -i wlan0 -j ACCEPT', callback);
    });
  });
}
  
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

setTimeout(createAccessPoint, 30000);

