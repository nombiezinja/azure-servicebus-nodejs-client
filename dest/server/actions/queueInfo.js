"use strict";

var _serviceBus = require("@azure/service-bus");

var connectionString = process.env.CONNECTION_STRING;
var queueName = process.env.QUEUE_NAME; // can prob replace with `${queueName}/$DeadLetterQueue`;
// and get rid of @azure/service-bus

var deadLetterQueueName = _serviceBus.QueueClient.getDeadLetterQueuePath(queueName);

var ns = _serviceBus.ServiceBusClient.createFromConnectionString(connectionString);

var sbService = azure.createServiceBusService(connectionString); // Get queue info

sbService.getQueue(queueName, function (err, data) {
  if (err) {
    console.log("error received", error);
  } else {
    console.log("data returned", data);
  }
});