'use strict';

let moment = require('moment');
let debug  = {
  client : require('debug')('socket:client'),
  server : require('debug')('socket:server'),
  auth   : require('debug')('socket:auth')
};

module.exports = class Log {

  /**
   * Logs a client event.
   * @param  {String} val
   * @return {Void}
   */
  static client(val) {
    debug.client(`${ moment().format('YYYY-MM-DD HH:mm:ss') } ${ val }`);
  }

  /**
   * Logs a server event.
   * @param  {String} val
   * @return {Void}
   */
  static server(val) {
    debug.server(`${ moment().format('YYYY-MM-DD HH:mm:ss') } ${ val }`);
  }

  /**
   * Logs a authentication event.
   * @param  {String} val
   * @return {Void}
   */
  static auth(val) {
    debug.auth(`  ${ moment().format('YYYY-MM-DD HH:mm:ss') } ${ val }`);
  }

}
