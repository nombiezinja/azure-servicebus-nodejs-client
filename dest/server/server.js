"use strict";

var _serviceBus = require("@azure/service-bus");

require('dotenv').config({
  silent: true
});

var ENV = process.env.NODE_ENV;
var port = process.env.PORT || 8080;

var express = require('express');

var http = require('http');

var app = express();
var server = http.createServer(app);

var path = require('path');

var azure = require('azure-sb');

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express["static"](path.join(__dirname, '../static')));
app.set('views', path.join(__dirname, '../static'));
var connectionString = process.env.CONNECTION_STRING;
var queueName = process.env.QUEUE_NAME; // Expose APIs for 
// non-destructive stream
// destructive stream 
// peek dead letter queue 

server.listen(port, function listening() {
  console.log("Server listening on ".concat(server.address().port));
});