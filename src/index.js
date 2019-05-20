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

function checkForMsgs(queue, exitIfEmpty) {
  sbService.receiveQueueMessage(queue, {
    isPeekLock: true
  }, function (err, lockedMessage) {
    if (err) {
      if (err == 'No messages to receive') {
        console.log(new Date(Date.now()) + ' No messages');
        if (exitIfEmpty) {
          emptyReturn+=1;
          if (emptyReturn > 5) {
            process.exit(0);
          }
        }
        return;
      } else {
        console.log(new Date(Date.now()) + " error received", err)
      }
    } else {
      console.log(new Date(Date.now()) + " lockedMessage", lockedMessage)
    }
  })
}

const checkChronically = (queueName, period, exitIfEmpty) => {
  setInterval(checkForMsgs.bind(null, queueName, exitIfEmpty), period);
}

// checkChronically(deadLetterQueueName, 1000)
// checkChronically(process.env.QUEUE_NAME, 5000, false)
// Get queue info
// sbService.getQueue(queueName, function(err, data){
//   if (err) {
//     console.log("error received", error)
//   } else {
//     console.log("data returned", data)
//   }
// })
const peekIncomingMsg = async (queueName) => {
  const client = ns.createQueueClient(queueName);
  const receiver = client.createReceiver(ReceiveMode.peekLock);

  // const messages = await receiver.receiveMessages(10);

  // console.log("messages", messages)
  // if (messages.length > 0) {
  //   messages.forEach((m) => {
  //     console.log(new Date(Date.now()) + ` Received message from ${queueName}`, m.body);
  //   })
  // } else {
  //   console.log(new Date(Date.now()) + ` No message recieved ${queueName}`);
  // }

  const onMessageHandler = async (brokeredMessage) => {
    console.log(`Received message: ${brokeredMessage.body}`);
    await brokeredMessage.complete();
  };
  const onErrorHandler = (err) => {
    console.log("Error occurred: ", err);
  };

  try {
    receiver.registerMessageHandler(onMessageHandler, onErrorHandler, {
      autoComplete: false
    });

    // Waiting long enough before closing the receiver to receive messages
    await delay(5000);

    await receiver.close();
    await client.close();
  } finally {
    await ns.close();
  }

  // await client.close();
}
peekIncomingMsg(process.env.QUEUE_NAME).catch((err) => {
  console.log(new Date(Date.now()) + " error:", err)
})

// const listen = async () => {
//     await peekIncomingMsg(process.env.QUEUE_NAME); 
// }

// listen()

server.listen(port, function listening() {
  console.log(`Server listening on ${server.address().port}`);
});