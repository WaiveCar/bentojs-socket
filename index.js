'use strict';

let io     = require('socket.io')();
let auth   = require('./lib/services/auth');
let Client = require('./lib/services/client');

module.exports = function load(config) {
  auth.setup(config);


  if (config.redis) {
    let redis = require('@socket.io/redis-adapter');
    io.adapter(redis({
      host : config.redis.host,
      port : config.redis.port
    }));
  }

  if (config.origins) {
    io.set('origins', (Object.prototype.toString.call(config.origins) === '[object Array]' ? config.origins.join(',') : config.origins));
  }

  io.on('connection', (socket) => {
    new Client(io, socket);
  });

  io.listen(config.port);
  console.log(`Server listening on port ${ config.port }`);
}
