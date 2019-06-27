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
    ServiceBusClient = _require.ServiceBusClient;

var connectionString = process.env.CONNECTION_STRING;
var queueName = process.env.QUEUE_NAME;
var plants = [{
  name: "Pothos",
  wateringInstructions: "frequently"
}, {
  name: "Bamboo",
  wateringInstructions: "frequently"
}, {
  name: "Aloe",
  wateringInstructions: "infrequently"
}];

function main() {
  return _main.apply(this, arguments);
}

function _main() {
  _main = (0, _asyncToGenerator3["default"])(
  /*#__PURE__*/
  _regenerator2["default"].mark(function _callee() {
    var ns, client, sender, index, plant, message;
    return _regenerator2["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.log("Send message");
            ns = ServiceBusClient.createFromConnectionString(connectionString); // If sending to a Topic, use `createTopicClient` instead of `createQueueClient`

            client = ns.createQueueClient(queueName);
            sender = client.createSender();
            _context.prev = 4;
            index = 0;

          case 6:
            if (!(index < plants.length)) {
              _context.next = 15;
              break;
            }

            plant = plants[index];
            message = {
              body: "".concat(plant.name, " is to be watered ").concat(plant.wateringInstructions),
              label: "plants"
            };
            console.log("Sending message: ".concat(message.body, " - ").concat(message.label));
            _context.next = 12;
            return sender.send(message);

          case 12:
            index++;
            _context.next = 6;
            break;

          case 15:
            _context.next = 17;
            return client.close();

          case 17:
            _context.prev = 17;
            _context.next = 20;
            return ns.close();

          case 20:
            return _context.finish(17);

          case 21:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[4,, 17, 21]]);
  }));
  return _main.apply(this, arguments);
}

exports["default"] = main;