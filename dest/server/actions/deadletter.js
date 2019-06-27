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

var _serviceBus = require("@azure/service-bus");

require('dotenv').config({
  silent: true
});

var connectionString = process.env.CONNECTION_STRING;
var queueName = process.env.QUEUE_NAME;
var deadLetterQueueName = "".concat(queueName, "/$DeadLetterQueue");

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
            console.log("Process dead letter message queue");
            client = ns.createQueueClient(deadLetterQueueName);
            receiver = client.createReceiver(_serviceBus.ReceiveMode.peekLock);
            _context2.next = 5;
            return receiver.receiveMessages(10);

          case 5:
            messages = _context2.sent;

            if (messages.length > 0) {
              messages.forEach(function (m) {
                console.log("Received the message from DLQ - ", m.body.toString());
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
}();

exports["default"] = processDLQ;