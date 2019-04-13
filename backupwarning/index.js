var express = require('express');
var fs = require('fs');
var path = require('path')
var http = require('http');
var https = require('https');

var app = express()

app.get('/caron', (req, res) => {
  res.end(JSON.stringify(new Date()));
  http.get('http://192.168.1.63/safety', (res) => {
    https.get('https://theamackers.com/text?msg=http://192.168.1.63/&password=yesyoumay&n=15304007823', (res) => {});
  });
});

app.listen(9090, function () {
    console.log('App listening on port 9090!')
})

process.on('uncaughtException', (err) => {
    console.log(`Caught exception: ${err}\n`);
});
