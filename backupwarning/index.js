var express = require('express');
var fs = require('fs');
var path = require('path')
var http = require('http');
var https = require('https');

var app = express()

var lastText = 0;
app.get('/caron', (req, res) => {
  res.end(JSON.stringify(new Date()));
  http.get('http://192.168.1.63/safety', (res) => {
    if ((new Date().getTime()) - lastText > 60000 * 5) {
      https.get('https://theamackers.com/text?msg=' + encodeURIComponent('Safety view - click: http://192.168.1.63/') + '&password=yesyoumay&n=15304001578', (res) => {});
    }
    lastText = new Date().getTime();
  });
});

app.get('/mattcaron', (req, res) => {
  res.end(JSON.stringify(new Date()));
  http.get('http://192.168.1.63/safety', (res) => {
    if ((new Date().getTime()) - lastText > 60000 * 5) {
      https.get('https://theamackers.com/text?msg=http://192.168.1.63/&password=yesyoumay&n=15304007823', (res) => {});
    }
    lastText = new Date().getTime();
  });
});

app.listen(9090, function () {
    console.log('App listening on port 9090!')
})

process.on('uncaughtException', (err) => {
    console.log(`Caught exception: ${err}\n`);
});
