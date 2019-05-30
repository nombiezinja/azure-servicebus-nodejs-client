"use strict";

var _interopRequireDefault3 = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireDefault2 = _interopRequireDefault3(require("@babel/runtime/helpers/interopRequireDefault"));

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require("@babel/runtime/regenerator");

var _regenerator2 = (0, _interopRequireDefault2["default"])(_regenerator);

var _asyncToGenerator2 = require("@babel/runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = (0, _interopRequireDefault2["default"])(_asyncToGenerator2);

require('dotenv').config();

var _require = require("@azure/service-bus"),
    ServiceBusClient = _require.ServiceBusClient,
    ReceiveMode = _require.ReceiveMode,
    delay = _require.delay; // non destructive look at message 


var connectionString = process.env.CONNECTION_STRING;
var queueName = process.env.QUEUE_NAME;

var main = function main() {
  var ns = ServiceBusClient.createFromConnectionString(connectionString);
  var client = ns.createQueueClient(queueName);
  var receiver = client.createReceiver(ReceiveMode.peekLock);

  var onMessageHandler =
  /*#__PURE__*/
  function () {
    var _ref = (0, _asyncToGenerator3["default"])(
    /*#__PURE__*/
    _regenerator2["default"].mark(function _callee(brokeredMessage) {
      return _regenerator2["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              console.log(new Date(Date.now()) + " Non destructive stream received message: ".concat(JSON.stringify(brokeredMessage.body))); // await brokeredMessage.complete();

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

  var onErrorHandler = function onErrorHandler(err) {
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
};

exports["default"] = main;