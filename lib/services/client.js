'use strict';

let co    = require('co');
let auth  = require('./auth');
let error = require('../error');
let User  = require('../models/user');

module.exports = class Client {

  /**
   * Sets up the socket.
   * @param  {Object} io     The primary IO instance for the server.
   * @param  {Object} socket The client socket connecting to the server.
   * @return {Void}
   */
  constructor(io, socket) {
    this.io     = io;
    this.socket = socket;
    this.user   = null;

    console.log(`Connected > ${ this.socket.id }`);

    // ### Socket Events
    // Attach available socket events to the classes internal methods.

    this.socket.on('authenticate', co.wrap(this.authenticate.bind(this)));
    this.socket.on('rooms',        co.wrap(this.rooms.bind(this)));
    this.socket.on('disconnect',   co.wrap(this.disconnect.bind(this)));
  }

  /**
   * Attempts to authenticate the socket against the configured API service.
   * @param  {String}   token The authentication token that validates against
   *                          the API authentication endpoint.
   * @return {Void}
   */
  *authenticate(token, done) {
    try {
      let data  = yield auth.getUser(token);
      let roles = yield auth.getRoles();

      this.user = new User(data, roles);

      // ### Join Rooms

      this.socket.join('user:' + this.user.id);
      if (this.user.hasAccess('admin')) {
        this.socket.join('admin');
      }

      console.log(`Authenticated > ${ this.user.name } <${ this.user.email }> [${ this.user.role.title }].`);

      done(null);
    } catch (err) {
      if (err.code === 'ECONNREFUSED') {
        done({
          code     : `AUTH_CONNECTION_ERROR`,
          message  : `Cannot connect to configured authentication server.`,
          solution : `Make sure the configured authentication server is reachable.`
        });
      } else {
        done(err);
      }
    }
  }

  /**
   * Returns a list of rooms if the requesting client has been authenticated and
   * has the required privileges to view the internal room lists.
   * @param  {Function} done The methods executed on the client side.
   * @return {Void}
   */
  *rooms(done) {
    if (!this.user || !this.user.hasAccess('admin')) {
      return done({
        code    : `ROOMS_INVALID_ACCESS`,
        message : `You do not have the required access privileges to access this request.`
      });
    }
    done(null, {
      rooms : this.io.sockets.adapter.rooms
    });
  }

  /**
   * Triggered when client disconnects from the server.
   * @return {Void}
   */
  *disconnect() {
    if (this.user) {
      return console.log(`Disconnected > ${ this.user.name } <${ this.user.email }>.`);
    }
    console.log(`Disconnected > [Guest] <${ this.socket.id }>`);
  }

};
