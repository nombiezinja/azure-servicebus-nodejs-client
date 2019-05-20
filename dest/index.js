"use strict";

var _interopRequireDefault3 = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireDefault2 = _interopRequireDefault3(require("@babel/runtime/helpers/interopRequireDefault"));

var _regenerator = require("@babel/runtime/regenerator");

var _regenerator2 = (0, _interopRequireDefault2["default"])(_regenerator);

var _asyncToGenerator2 = require("@babel/runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = (0, _interopRequireDefault2["default"])(_asyncToGenerator2);

var _serviceBus = require("@azure/service-bus");

require('dotenv').config({
  silent: true
});

var ENV = process.env.NODE_ENV;
var port = process.env.PORT || 8080;

var express = require('express');

var http = require('http');

var app = express();
var server = http.createServer(app);

var path = require('path');

var azure = require('azure-sb');

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express["static"](path.join(__dirname, '../static')));
app.set('views', path.join(__dirname, '../static'));
var connectionString = process.env.CONNECTION_STRING;
var queueName = process.env.QUEUE_NAME; // can prob replace with `${queueName}/$DeadLetterQueue`;
// and get rid of @azure/service-bus

var deadLetterQueueName = _serviceBus.QueueClient.getDeadLetterQueuePath(queueName);

var ns = _serviceBus.ServiceBusClient.createFromConnectionString(connectionString);

var processDLQ =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator3["default"])(
  /*#__PURE__*/
  _regenerator2["default"].mark(function _callee() {
    return _regenerator2["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return processDeadletterMessageQueue();

          case 3:
            _context.prev = 3;
            _context.next = 6;
            return ns.close();

          case 6:
            return _context.finish(3);

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0,, 3, 7]]);
  }));

  return function processDLQ() {
    return _ref.apply(this, arguments);
  };
}();

var processDeadletterMessageQueue =
/*#__PURE__*/
function () {
  var _ref2 = (0, _asyncToGenerator3["default"])(
  /*#__PURE__*/
  _regenerator2["default"].mark(function _callee2() {
    var client, receiver, messages;
    return _regenerator2["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            client = ns.createQueueClient(deadLetterQueueName);
            receiver = client.createReceiver(_serviceBus.ReceiveMode.peekLock);
            _context2.next = 4;
            return receiver.receiveMessages(1);

          case 4:
            messages = _context2.sent;
            console.log("messages", messages);

            if (messages.length > 0) {
              messages.forEach(function (m) {
                console.log("Received the message from DLQ - ", m.body);
                console.log("Could not be delivered because:", m.userProperties.DeadLetterReason, m.userProperties.DeadLetterErrorDescription);
              });
            } else {
              console.log("Error: No messages were received from the DLQ.");
            }

            _context2.next = 9;
            return client.close();

          case 9:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function processDeadletterMessageQueue() {
    return _ref2.apply(this, arguments);
  };
}(); // processDLQ();


var sbService = azure.createServiceBusService(connectionString);
var emptyReturn = 0;

function checkForMsgs(queue, exitIfEmpty) {
  sbService.receiveQueueMessage(queue, {
    isPeekLock: true
  }, function (err, lockedMessage) {
    if (err) {
      if (err == 'No messages to receive') {
        console.log(new Date(Date.now()) + ' No messages');

        if (exitIfEmpty) {
          emptyReturn += 1;

          if (emptyReturn > 5) {
            process.exit(0);
          }
        }

        return;
      } else {
        console.log(new Date(Date.now()) + " error received", err);
      }
    } else {
      console.log(new Date(Date.now()) + " lockedMessage", lockedMessage);
    }
  });
}

var checkChronically = function checkChronically(queueName, period, exitIfEmpty) {
  setInterval(checkForMsgs.bind(null, queueName, exitIfEmpty), period);
}; // checkChronically(deadLetterQueueName, 1000)
// checkChronically(process.env.QUEUE_NAME, 5000, false)
// Get queue info
// sbService.getQueue(queueName, function(err, data){
//   if (err) {
//     console.log("error received", error)
//   } else {
//     console.log("data returned", data)
//   }
// })


var peekIncomingMsg =
/*#__PURE__*/
function () {
  var _ref3 = (0, _asyncToGenerator3["default"])(
  /*#__PURE__*/
  _regenerator2["default"].mark(function _callee4(queueName) {
    var client, receiver, onMessageHandler, onErrorHandler;
    return _regenerator2["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            client = ns.createQueueClient(queueName);
            receiver = client.createReceiver(_serviceBus.ReceiveMode.peekLock); // const messages = await receiver.receiveMessages(10);
            // console.log("messages", messages)
            // if (messages.length > 0) {
            //   messages.forEach((m) => {
            //     console.log(new Date(Date.now()) + ` Received message from ${queueName}`, m.body);
            //   })
            // } else {
            //   console.log(new Date(Date.now()) + ` No message recieved ${queueName}`);
            // }

            onMessageHandler =
            /*#__PURE__*/
            function () {
              var _ref4 = (0, _asyncToGenerator3["default"])(
              /*#__PURE__*/
              _regenerator2["default"].mark(function _callee3(brokeredMessage) {
                return _regenerator2["default"].wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        console.log("Received message: ".concat(brokeredMessage.body));
                        _context3.next = 3;
                        return brokeredMessage.complete();

                      case 3:
                      case "end":
                        return _context3.stop();
                    }
                  }
                }, _callee3);
              }));

              return function onMessageHandler(_x2) {
                return _ref4.apply(this, arguments);
              };
            }();

            onErrorHandler = function onErrorHandler(err) {
              console.log("Error occurred: ", err);
            };

            _context4.prev = 4;
            receiver.registerMessageHandler(onMessageHandler, onErrorHandler, {
              autoComplete: false
            }); // Waiting long enough before closing the receiver to receive messages

            _context4.next = 8;
            return (0, _serviceBus.delay)(5000);

          case 8:
            _context4.next = 10;
            return receiver.close();

          case 10:
            _context4.next = 12;
            return client.close();

          case 12:
            _context4.prev = 12;
            _context4.next = 15;
            return ns.close();

          case 15:
            return _context4.finish(12);

          case 16:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[4,, 12, 16]]);
  }));

  return function peekIncomingMsg(_x) {
    return _ref3.apply(this, arguments);
  };
}();

peekIncomingMsg(process.env.QUEUE_NAME)["catch"](function (err) {
  console.log(new Date(Date.now()) + " error:", err);
}); // const listen = async () => {
//     await peekIncomingMsg(process.env.QUEUE_NAME); 
// }
// listen()

server.listen(port, function listening() {
  console.log("Server listening on ".concat(server.address().port));
});