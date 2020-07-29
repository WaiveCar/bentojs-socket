'use strict';

module.exports = class ErrorHandler {

  /**
   * Parses an object and returns an error.
   * @param  {Object} err
   * @param  {Int}    [status]
   * @return {Error}
   */
  static parse(err, status) {
    let error        = new Error(err.message || err.toString());
        error.status = status || 500;
        error.code   = err.code;

    if (err.solution) { error.solution = err.solution; }
    if (err.data)     { error.data     = err.data; }
    if (err.stack)    { error.stack    = ErrorHandler.parseStack(err.stack); }

    return error;
  }

  /**
   * Prepares an error to be transmitted or otherwise handled by a end user.
   * @param  {Object} err
   * @return {Object}
   */
  static prepare(err) {
    return {
      code    : err.code,
      message : err.toString().replace('Error: ', ''),
      data    : err.data
    };
  }

}
