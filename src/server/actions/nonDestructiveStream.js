require('dotenv').config();

const {
  ServiceBusClient,
  ReceiveMode,
  delay
} = require("@azure/service-bus");

// non destructive look at message 

const connectionString = process.env.CONNECTION_STRING;
const queueName = process.env.QUEUE_NAME;

const main = () => {
  const ns = ServiceBusClient.createFromConnectionString(connectionString);

  const client = ns.createQueueClient(queueName);

  const receiver = client.createReceiver(ReceiveMode.peekLock);

  const onMessageHandler = async (brokeredMessage) => {
    console.log(new Date(Date.now()) + ` Non destructive stream received message: ${JSON.stringify(brokeredMessage.body)}`);
    // await brokeredMessage.complete();
  };
  const onErrorHandler = (err) => {
    console.log("Error occurred: ", err);
  };

  try {
    receiver.registerMessageHandler(onMessageHandler, onErrorHandler, {
      autoComplete: false
    });

    // Waiting long enough before closing the receiver to receive messages
    // await delay(5000);

    // await receiver.close();
    // await client.close();
  } finally {
    // await ns.close();
  }
}

export default main;