var child_process = require('child_process');
var exec = child_process.exec;
var fs = require('fs');
var tmp = require('tmp');

// Collection of functions for easy access to network manipulation tools on
// a Reaspberry PI.
class APExecs {

  // Simple function for using the command line for taking down an interface.
  static takeDown(iface, callback) {
    exec('ifdown ' + iface, callback);
  }

  // Simplified function for making use of ifconfig command line tool.
  //ifconfig -v wlan0 inet 172.24.1.1
  //ifconfig -v wlan0 broadcast 172.24.1.255
  static ifconfig(iface, addressType, address, callback) {
    exec('ifconfig ' + iface + " "+ addressType + " " + address, callback);
  }

  // Simplified interface to iptables.
  static iptables(iface, flagString, callback) {
    var command = 'iptables -o ' + iface + " " + flagString;
    exec(command, callback);
  }

  // Function for making hostapd available to nodejs.  Has basic options
  // for the AP, but also allows for pass-in configuration parameters.
  static hostapd(options, callback) {
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

    var finalOptions = Object.assign(defaultOptions, options);
    if (options.password) {
      finalOptions.wpa_passphrase = finalOptions.password;
      delete finalOptions.password;
    }
   
    Object.getOwnPropertyNames(finalOptions).forEach(function(key) {
      commands.push(key + '=' + finalOptions[key]);
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
  static dnsmasq(options, callback) {
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
}

module.exports = APExecs;
