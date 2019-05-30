import {
  ServiceBusMessage,
  ServiceBusClient,
  ReceiveMode,
  QueueClient, 
  delay
} from "@azure/service-bus";


const connectionString = process.env.CONNECTION_STRING;
const queueName = process.env.QUEUE_NAME;

// can prob replace with `${queueName}/$DeadLetterQueue`;
// and get rid of @azure/service-bus
const deadLetterQueueName = QueueClient.getDeadLetterQueuePath(queueName);
const ns = ServiceBusClient.createFromConnectionString(connectionString);


const sbService = azure.createServiceBusService(connectionString);

// Get queue info
const main = () => {
  sbService.getQueue(queueName, function(err, data){
    if (err) {
      console.log("error received", error)
    } else {
      console.log("data returned", data)
    }
  })
}

export default main;