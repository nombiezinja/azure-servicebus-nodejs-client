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
// const azure = require('azure-sb');

import { ServiceBusMessage, ServiceBusClient, ReceiveMode, QueueClient } from "@azure/service-bus";

app.set('view engine', 'ejs');

app.use(express.json()) 
app.use(express.static(path.join(__dirname, '../static')));
app.set('views', path.join(__dirname, '../static'));


const connectionString = process.env.CONNECTION_STRING;
const queueName = process.env.QUEUE_NAME;

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

    // Do something with the message retrieved from DLQ

    // Mark message as complete/processed.
  } else {
    console.log("Error: No messages were received from the DLQ.");
  }

  await client.close();
}
// processDeadletterMessageQueue()

processDLQ();


// function checkForMessages(sbService, queueName, callback) {
//   sbService.receiveQueueMessage(queueName, { isPeekLock: true }, function (err, lockedMessage) {
//     if (err) {
//       if (err == 'No messages to receive') {
//         console.log('No messages');
//       } else {
//         // callback(err);
//         console.log("error received", err)
//       }
//     } else {
//       // callback(null, lockedMessage);
//       console.log("lockedMessage", lockedMessage)
//     }
//   });
// }

// function processMessage(sbService, err, lockedMsg) {
//   if (err) {
//     console.log('Error on Rx: ', err);
//   } else {
//     console.log('Rx: ', lockedMsg);
//     sbService.deleteMessage(lockedMsg, function(err2) {
//       if (err2) {
//         console.log('Failed to delete message: ', err2);
//       } else {
//         console.log('Deleted message.');
//       }
//     })
//   }
// }
// var connStr = process.env.CONNECTION_STRING;
// if (!connStr) throw new Error('Must provide connection string');
// var queueName = 'dev-integration-inflow';
 
// console.log('Connecting to ' + connStr + ' queue ' + queueName);
// var sbService = azure.createServiceBusService(connStr);
// // sbService.createQueueIfNotExists(queueName, function (err) {
// //   if (err) {
// //    console.log('Failed to create queue: ', err);
// //   } else {
//   //  setInterval(checkForMessages.bind(null, sbService, queueName, processMessage.bind(null, sbService)), 5000);
// //    setInterval(sendMessages.bind(null, sbService, queueName), 15000);
// //   }
// // });

// sbService.getQueue(queueName, function(err, data){
//   if (err) {
//     console.log("error received", error)
//   } else {
//     console.log("data returned", data)
//   }
// })

// sbService.receiveQueueMessage(queueName, { isPeekLock: true }, function (err, lockedMessage) {
//   if (err) {
//     if (err == 'No messages to receive') {
//       console.log('No messages');
//     } else {
//       // callback(err);
//       console.log("error received", err)
//     }
//   } else {
//     // callback(null, lockedMessage);
//     console.log("lockedMessage", lockedMessage)
//   }
// });


server.listen(port, function listening() {
  console.log(`Server listening on ${server.address().port}`);
});

