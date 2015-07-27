// Copyright 2015 Gautam Mittal under the MIT License

var express = require('express');
var app = express();
var bodyParser = require('body-parser')

var port = 3000;

app.post('/', function (req, res) {
  res.send('Hello World!');
});

var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});