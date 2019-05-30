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
    delay = _require.delay;

var connectionString = process.env.CONNECTION_STRING;
var queueName = process.env.QUEUE_NAME;

var main =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator3["default"])(
  /*#__PURE__*/
  _regenerator2["default"].mark(function _callee2() {
    var ns, client, receiver, onMessageHandler, onErrorHandler;
    return _regenerator2["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            ns = ServiceBusClient.createFromConnectionString(connectionString);
            client = ns.createQueueClient(queueName);
            receiver = client.createReceiver(ReceiveMode.receiveAndDelete);

            onMessageHandler =
            /*#__PURE__*/
            function () {
              var _ref2 = (0, _asyncToGenerator3["default"])(
              /*#__PURE__*/
              _regenerator2["default"].mark(function _callee(brokeredMessage) {
                return _regenerator2["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        console.log(new Date(Date.now()) + " Destructive stream received message: ".concat(JSON.stringify(brokeredMessage.body)));

                      case 1:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function onMessageHandler(_x) {
                return _ref2.apply(this, arguments);
              };
            }();

            onErrorHandler = function onErrorHandler(err) {
              console.log("Error occurred: ", err);
            };

            _context2.prev = 5;
            receiver.registerMessageHandler(onMessageHandler, onErrorHandler, {
              autoComplete: false
            }); // Waiting long enough before closing the receiver to receive messages

            _context2.next = 9;
            return delay(5000);

          case 9:
            _context2.next = 11;
            return receiver.close();

          case 11:
            _context2.next = 13;
            return client.close();

          case 13:
            _context2.prev = 13;
            _context2.next = 16;
            return ns.close();

          case 16:
            return _context2.finish(13);

          case 17:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[5,, 13, 17]]);
  }));

  return function main() {
    return _ref.apply(this, arguments);
  };
}();

exports["default"] = main;