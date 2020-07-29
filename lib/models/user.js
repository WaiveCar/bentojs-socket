'use strict';

module.exports = class User {

  /**
   * Assigns provided data and roles to the instance.
   * @param  {Object} data
   * @param  {Array} _roles
   * @return {Void}
   */
  constructor(data, _roles) {
    this._roles = _roles;
    for (let key in data) {
      if (!this.hasOwnProperty(key)) {
        this[key] = data[key];
      }
    }
  }

  /**
   * Returns the users first name and first letter of last name.
   * @return {String}
   */
  name() {
    return `${ this.firstName } ${ this.lastName[0] }.`;
  }

  /**
   * Returnst he access privileges of the user.
   * @param  {String}  role
   * @return {Boolean}
   */
  hasAccess(role) {
    let check = this._roles.find(val => val.name === role);
    let auth  = this._roles.find(val => val.name === this.role.name);

    // ### Access Check
    // If provided role is less than authenticated role we have access.

    return check.position <= auth.position;
  }

};
