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

function hostapd(options, callback) {
  var commands = [];
  var defaultOptions = {
    driver:'nl80211',
    channel:6,
    hw_mode:'g',
    interface:'wlan0',
    ssid:'MattWuzHere',
    wpa:'2',
    wpa_passphrase:'roadrunner'
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
}
  
  

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
    });
  });
});


  /*
  var options = {
    channel: 6,
    hw_mode: 'g',
    interface: 'wlan0',
    ssid: 'RaspberryPI',
    wpa:2,
    wpa_passphrase: 'raspberry'
  };

  hostapd.enable(options, (err) => {
    if (err) {
      console.log("Error seen: ", err);
    } else {
      console.log("No error AP should be running.");
    }

    ifconfig.up({interface: 'wlan0'}, (err) => {
      console.log("Ifconfig bring up erro?", err);
    });
  });
  */
//});



