'use strict';

let request = require('co-request');
let log     = require('../log');

module.exports = {

  config : null,
  roles  : null,

  /**
   * Sets up the configuration with the authentication service.
   * @param  {Object} config
   * @return {Void}
   */
  setup(config) {
    this.config = parseConfig(config);
  },

  /**
   * Loads the roles from the api endpoint.
   * @param  {Function} done [description]
   * @return {[type]}        [description]
   */
  *getRoles() {
    if (!this.roles) {
      this.hasConfig();
      let res  = yield request(this.config.roles);
      let body = JSON.parse(res.body);
      if (res.statusCode !== 200) {
        throw body;
      }
      this.roles = body;
    }
    return this.roles;
  },

  /**
   * Returns an authenticated user based on the provided token.
   * @param  {String}   token The authentication token.
   * @param  {Function} done
   * @return {Void}
   */
  *getUser(token) {
    this.hasConfig();
    let res = yield request({
      method  : 'GET',
      uri     : this.config.me,
      headers : {
        Authorization : token
      }
    });
    let body = JSON.parse(res.body);
    if (res.statusCode !== 200) {
      throw body;
    }
    return body;
  },

  /**
   * Verifies that the auth service is available by checking configuration settings.
   * @param  {Function} done
   * @return {Boolean}
   */
  hasConfig(done) {
    if (!this.config) {
      throw new Error(`The current socket server does not support authentication.`);
    }
  }

};

/**
 * Validates the configuration settings required for authentication service to work.
 * @param  {Object} config
 * @return {Object}
 */
function parseConfig(config) {
  if (!config || !config.api) {
    log.auth(`Missing api configuration, authentication features disabled.`);
    return;
  }
  if (!config.api.me || !config.api.roles) {
    log.auth(`Missing API configuration for me and/or roles, authentication features disabled.`);
    return;
  }
  return {
    me    : config.api.url + config.api.me,
    roles : config.api.url + config.api.roles
  };
}
