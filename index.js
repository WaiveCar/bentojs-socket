'use strict';

let io     = require('socket.io')();
let log    = require('./lib/log');
let auth   = require('./lib/services/auth');
let Client = require('./lib/services/client');

module.exports = function load(config) {
  auth.setup(config);

  // ### Setup Adapter

  if (config.redis) {
    let redis = require('socket.io-redis');
    io.adapter(redis({
      host : config.redis.host,
      port : config.redis.port
    }));
  }

  // ### Origins
  // Set the allowed access origins.

  if (config.origins) {
    io.set('origins', (Object.prototype.toString.call(config.origins) === '[object Array]' ? config.origins.join(',') : config.origins));
  }

  // ### Connect

  io.on('connection', (socket) => {
    new Client(io, socket);
  });

  // ### Listen

  io.listen(config.port);
  log.server(`Server listening on port ${ config.port }`);
}
