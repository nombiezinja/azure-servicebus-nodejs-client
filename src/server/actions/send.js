require('dotenv').config();

const {
  ServiceBusClient
} = require("@azure/service-bus");
const connectionString = process.env.CONNECTION_STRING;
const queueName = process.env.QUEUE_NAME;

const plants = [{
    name: "Pothos",
    wateringInstructions: "frequently"
  },
  {
    name: "Bamboo",
    wateringInstructions: "frequently"
  },
  {
    name: "Aloe",
    wateringInstructions: "infrequently"
  }
];

async function main() {
  console.log("Send message")
  const ns = ServiceBusClient.createFromConnectionString(connectionString);

  // If sending to a Topic, use `createTopicClient` instead of `createQueueClient`
  const client = ns.createQueueClient(queueName);
  const sender = client.createSender();

  try {
    for (let index = 0; index < plants.length; index++) {
      const plant = plants[index];
      const message = {
        body: `${plant.name} is to be watered ${plant.wateringInstructions}`,
        label: "plants"
      };

      console.log(`Sending message: ${message.body} - ${message.label}`);
      await sender.send(message);
    }

    await client.close();
  } finally {
    await ns.close();
  }
}

export default main; 
