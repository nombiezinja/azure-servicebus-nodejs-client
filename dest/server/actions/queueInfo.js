"use strict";

var _interopRequireDefault3 = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireDefault2 = _interopRequireDefault3(require("@babel/runtime/helpers/interopRequireDefault"));

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof2 = require("@babel/runtime/helpers/typeof");

var _typeof3 = (0, _interopRequireDefault2["default"])(_typeof2);

// Get queue info
var main = function main(sbService, queueName) {
  return new Promise(function (resolve, reject) {
    return sbService.getQueue(queueName, function (err, data) {
      if (err) {
        console.log("error received", error);
        reject(error);
      } else {
        console.log("data returned", (0, _typeof3["default"])(data));
        resolve(data);
      }
    });
  });
};

exports["default"] = main;