'use strict';

const express = require('express');

const app = express();

let isOn = false;
let http = null;


// server running need to add mongo

module.exports = {
  start: () => {
    return new Promise((resolve, reject) => {
      if (isOn)
        return reject(new Error('SERVER_ERROR: server is already running'));
      http = app.listen(process.env.PORT, () => {
        isOn = true;
        console.log('SERVER_ON:', process.env.PORT);
        resolve();
      });
    });
  },
  stop: () => {
    return new Promise((resolve, reject) => {
      if (!isOn)
        return reject(new Error('SERVER_ERROR: server already off'));
      if (!http)
        return reject(new Error('SERVER_ERROR: there is no server to close'));
      http.close(() => {
        isOn = false;
        http = null;
        console.log('SERVER_OFF');
        resolve();
      });
    });
  },
};