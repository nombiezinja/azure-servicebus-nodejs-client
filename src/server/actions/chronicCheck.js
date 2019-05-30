require('dotenv').config({
  silent: true
});

const azure = require('azure-sb');

const connectionString = process.env.CONNECTION_STRING;
const queueName = process.env.QUEUE_NAME;

// can prob replace with `${queueName}/$DeadLetterQueue`;
// and get rid of @azure/service-bus
const deadLetterQueueName = `${queueName}/$DeadLetterQueue`;

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
export default checkChronically; 
