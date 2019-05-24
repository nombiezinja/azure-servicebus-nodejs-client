"use strict";

var _interopRequireDefault3 = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireDefault2 = _interopRequireDefault3(require("@babel/runtime/helpers/interopRequireDefault"));

var _regenerator = require("@babel/runtime/regenerator");

var _regenerator2 = (0, _interopRequireDefault2["default"])(_regenerator);

var _asyncToGenerator2 = require("@babel/runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = (0, _interopRequireDefault2["default"])(_asyncToGenerator2);

require('dotenv').config();

var _require = require("@azure/service-bus"),
    ServiceBusClient = _require.ServiceBusClient,
    ReceiveMode = _require.ReceiveMode,
    delay = _require.delay; // non destructive look at message 
// Define connection string and related Service Bus entity names here


var connectionString = process.env.CONNECTION_STRING;
var queueName = process.env.QUEUE_NAME;

function main() {
  return _main.apply(this, arguments);
}

function _main() {
  _main = (0, _asyncToGenerator3["default"])(
  /*#__PURE__*/
  _regenerator2["default"].mark(function _callee2() {
    var ns, client, receiver, onMessageHandler, onErrorHandler;
    return _regenerator2["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            console.log("Main running");
            ns = ServiceBusClient.createFromConnectionString(connectionString); // If receiving from a Subscription, use `createSubscriptionClient` instead of `createQueueClient`

            client = ns.createQueueClient(queueName); // To receive messages from sessions, use getSessionReceiver instead of getReceiver or look at
            // the sample in sessions.js file

            receiver = client.createReceiver(ReceiveMode.peekLock);

            onMessageHandler =
            /*#__PURE__*/
            function () {
              var _ref = (0, _asyncToGenerator3["default"])(
              /*#__PURE__*/
              _regenerator2["default"].mark(function _callee(brokeredMessage) {
                return _regenerator2["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        console.log(new Date(Date.now()) + " Received message: ".concat(JSON.stringify(brokeredMessage.body))); // await brokeredMessage.complete();

                      case 1:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function onMessageHandler(_x) {
                return _ref.apply(this, arguments);
              };
            }();

            onErrorHandler = function onErrorHandler(err) {
              console.log("Error occurred: ", err);
            };

            try {
              receiver.registerMessageHandler(onMessageHandler, onErrorHandler, {
                autoComplete: false
              }); // Waiting long enough before closing the receiver to receive messages
              // await delay(5000);
              // await receiver.close();
              // await client.close();
            } finally {// await ns.close();
            }

          case 7:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _main.apply(this, arguments);
}

main()["catch"](function (err) {
  console.log("Error occurred: ", err);
});