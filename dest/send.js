"use strict";

var _interopRequireDefault3 = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireDefault2 = _interopRequireDefault3(require("@babel/runtime/helpers/interopRequireDefault"));

var _regenerator = require("@babel/runtime/regenerator");

var _regenerator2 = (0, _interopRequireDefault2["default"])(_regenerator);

var _asyncToGenerator2 = require("@babel/runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = (0, _interopRequireDefault2["default"])(_asyncToGenerator2);

require('dotenv').config();

var _require = require("@azure/service-bus"),
    ServiceBusClient = _require.ServiceBusClient;

console.log("connection string", connectionString);
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
            ns = ServiceBusClient.createFromConnectionString(connectionString); // If sending to a Topic, use `createTopicClient` instead of `createQueueClient`

            client = ns.createQueueClient(queueName);
            sender = client.createSender();
            _context.prev = 3;
            index = 0;

          case 5:
            if (!(index < plants.length)) {
              _context.next = 14;
              break;
            }

            plant = plants[index];
            message = {
              body: "".concat(plant.name, " is to be watered ").concat(plant.wateringInstructions),
              label: "plants"
            };
            console.log("Sending message: ".concat(message.body, " - ").concat(message.label));
            _context.next = 11;
            return sender.send(message);

          case 11:
            index++;
            _context.next = 5;
            break;

          case 14:
            _context.next = 16;
            return client.close();

          case 16:
            _context.prev = 16;
            _context.next = 19;
            return ns.close();

          case 19:
            return _context.finish(16);

          case 20:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[3,, 16, 20]]);
  }));
  return _main.apply(this, arguments);
}

main()["catch"](function (err) {
  console.log("Error occurred: ", err);
});