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

import {ServiceBusMessage,ServiceBusClient,ReceiveMode,QueueClient, delay} from "@azure/service-bus";

app.set('view engine', 'ejs');

app.use(express.json())
app.use(express.static(path.join(__dirname, '../static')));
app.set('views', path.join(__dirname, '../static'));

const connectionString = process.env.CONNECTION_STRING;
const queueName = process.env.QUEUE_NAME;

// TODO Initiate azure sb client here and pass to middleware

app.get('/', (req,res) => {
  res.status(200).send("hello am sb explorer");
})

// non-destructive stream
app.get('/non-destructive-stream', (req,res) => {
  res.status(200).send("hello am non destructive stream");
})

// destructive stream 
app.get('/destructive-stream', (req,res) => {
  res.status(200).send("hello am destructive stream");
})

// peek dead letter queue 
app.get('/dead-letter-queue', (req,res) => {
  res.status(200).send("hello am dead letter queue");
})

// send msg
app.get('/send-msg', (req,res) => {
  res.status(200).send("hello am send msg");
})

server.listen(port, function listening() {
  console.log(`Server listening on ${server.address().port}`);
});