require('dotenv').config({
  silent: true
});

const ENV = process.env.NODE_ENV;
const port = process.env.PORT || 8080;

const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const path = require('path');
const azure = require('azure-sb');

import {
  ServiceBusMessage,
  ServiceBusClient,
  ReceiveMode,
  QueueClient, 
  delay
} from "@azure/service-bus";

app.set('view engine', 'ejs');

app.use(express.json())
app.use(express.static(path.join(__dirname, '../static')));
app.set('views', path.join(__dirname, '../static'));


const connectionString = process.env.CONNECTION_STRING;
const queueName = process.env.QUEUE_NAME;

server.listen(port, function listening() {
  console.log(`Server listening on ${server.address().port}`);
});