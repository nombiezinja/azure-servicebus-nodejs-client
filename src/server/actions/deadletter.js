require('dotenv').config({
  silent: true
});

import {ServiceBusClient,ReceiveMode} from "@azure/service-bus";

const connectionString = process.env.CONNECTION_STRING;
const queueName = process.env.QUEUE_NAME;

const deadLetterQueueName = `${queueName}/$DeadLetterQueue`;
const ns = ServiceBusClient.createFromConnectionString(connectionString);

const processDLQ = async () => {
  try {
    await processDeadletterMessageQueue();
  } finally {
    await ns.close();
  }
}
const processDeadletterMessageQueue = async () => {
  console.log("Process dead letter message queue")
  const client = ns.createQueueClient(deadLetterQueueName);
  const receiver = client.createReceiver(ReceiveMode.peekLock);

  const messages = await receiver.receiveMessages(10);

  if (messages.length > 0) {
    messages.forEach((m) => {
      console.log("Received the message from DLQ - ", m.body.toString());
      console.log("Could not be delivered because:", m.userProperties.DeadLetterReason, m.userProperties.DeadLetterErrorDescription);
    })
  } else {
    console.log("Error: No messages were received from the DLQ.");
  }

  await client.close();
}

export default processDLQ;