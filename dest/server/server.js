"use strict";

var _interopRequireDefault3 = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireDefault2 = _interopRequireDefault3(require("@babel/runtime/helpers/interopRequireDefault"));

var _regenerator = require("@babel/runtime/regenerator");

var _regenerator2 = (0, _interopRequireDefault2["default"])(_regenerator);

var _asyncToGenerator2 = require("@babel/runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = (0, _interopRequireDefault2["default"])(_asyncToGenerator2);

var _serviceBus = require("@azure/service-bus");

var _deadletter = require("./actions/deadletter");

var _deadletter2 = (0, _interopRequireDefault2["default"])(_deadletter);

var _destructiveStream = require("./actions/destructiveStream");

var _destructiveStream2 = (0, _interopRequireDefault2["default"])(_destructiveStream);

var _nonDestructiveStream = require("./actions/nonDestructiveStream");

var _nonDestructiveStream2 = (0, _interopRequireDefault2["default"])(_nonDestructiveStream);

var _queueInfo = require("./actions/queueInfo");

var _queueInfo2 = (0, _interopRequireDefault2["default"])(_queueInfo);

var _send = require("./actions/send");

var _send2 = (0, _interopRequireDefault2["default"])(_send);

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
var queueName = process.env.QUEUE_NAME;
var sbService = azure.createServiceBusService(connectionString); // TODO Initiate azure sb client here and pass to middleware

app.get('/', function (req, res) {
  res.status(200).send("hello am sb explorer");
}); // non-destructive stream

app.get('/non-destructive-stream', function (req, res) {
  res.status(200).send("hello am non destructive stream");
}); // destructive stream 

app.get('/destructive-stream', function (req, res) {
  res.status(200).send("hello am destructive stream");
}); // peek dead letter queue 

app.get('/dead-letter-queue', function (req, res) {
  res.status(200).send("hello am dead letter queue");
}); // send msg

app.get('/send-msg', function (req, res) {
  (0, _send2["default"])();
  res.status(200).send("hello am send msg");
});
app.get('/queue-info',
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator3["default"])(
  /*#__PURE__*/
  _regenerator2["default"].mark(function _callee(req, res) {
    var queueInfo;
    return _regenerator2["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _queueInfo2["default"])(sbService, queueName);

          case 2:
            queueInfo = _context.sent;
            res.status(200).send(JSON.stringify(queueInfo));

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
server.listen(port, function listening() {
  console.log("Server listening on ".concat(server.address().port));
});