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
    delay = _require.delay;

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
            ns = ServiceBusClient.createFromConnectionString(connectionString);
            client = ns.createQueueClient(queueName);
            receiver = client.createReceiver(ReceiveMode.receiveAndDelete);

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
                        console.log(new Date(Date.now()) + " Received message: ".concat(JSON.stringify(brokeredMessage.body)));
                        _context.next = 3;
                        return brokeredMessage.complete();

                      case 3:
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

            _context2.prev = 6;
            receiver.registerMessageHandler(onMessageHandler, onErrorHandler, {
              autoComplete: false
            }); // Waiting long enough before closing the receiver to receive messages

            _context2.next = 10;
            return delay(5000);

          case 10:
            _context2.next = 12;
            return receiver.close();

          case 12:
            _context2.next = 14;
            return client.close();

          case 14:
            _context2.prev = 14;
            _context2.next = 17;
            return ns.close();

          case 17:
            return _context2.finish(14);

          case 18:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[6,, 14, 18]]);
  }));
  return _main.apply(this, arguments);
}

main()["catch"](function (err) {
  console.log("Error occurred: ", err);
});