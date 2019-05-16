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
  QueueClient
} from "@azure/service-bus";

app.set('view engine', 'ejs');

app.use(express.json())
app.use(express.static(path.join(__dirname, '../static')));
app.set('views', path.join(__dirname, '../static'));


const connectionString = process.env.CONNECTION_STRING;
const queueName = process.env.QUEUE_NAME;

// can prob replace with `${queueName}/$DeadLetterQueue`;
// and get rid of @azure/service-bus
const deadLetterQueueName = QueueClient.getDeadLetterQueuePath(queueName);
const ns = ServiceBusClient.createFromConnectionString(connectionString);

const processDLQ = async () => {
  try {
    await processDeadletterMessageQueue();
  } finally {
    await ns.close();
  }
}

const processDeadletterMessageQueue = async () => {
  const client = ns.createQueueClient(deadLetterQueueName);
  const receiver = client.createReceiver(ReceiveMode.peekLock);

  const messages = await receiver.receiveMessages(1);

  console.log("messages", messages)
  if (messages.length > 0) {
    messages.forEach((m) => {
      console.log("Received the message from DLQ - ", m.body);
      console.log("Could not be delivered because:", m.userProperties.DeadLetterReason, m.userProperties.DeadLetterErrorDescription);
    })
  } else {
    console.log("Error: No messages were received from the DLQ.");
  }

  await client.close();
}
// processDLQ();

const sbService = azure.createServiceBusService(connectionString);

let emptyReturn = 0;

const checkForMsgs = () => {
  sbService.receiveQueueMessage(deadLetterQueueName, {
    isPeekLock: true
  }, function (err, lockedMessage) {
    if (err) {
      if (err == 'No messages to receive') {
        console.log('No messages');
        emptyReturn+=1;
        console.log("empty return", emptyReturn)
        if (emptyReturn > 5) {
          process.exit(0);
        }
        return;
      } else {
        console.log("error received", err)
      }
    } else {
      console.log("lockedMessage", lockedMessage)
    }
  })
}

setInterval(checkForMsgs, 1000);

sbService.getQueue(queueName, function(err, data){
  if (err) {
    console.log("error received", error)
  } else {
    console.log("data returned", data)
  }
})

server.listen(port, function listening() {
  console.log(`Server listening on ${server.address().port}`);
});