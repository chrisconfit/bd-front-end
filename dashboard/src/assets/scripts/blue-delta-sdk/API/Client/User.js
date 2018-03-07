goog.provide('API.Client.User');

/**
 * @record
 */
API.Client.User = function() {}

/**
 * @type {!string}
 * @export
 */
API.Client.User.prototype.identityId;

/**
 * @type {!string}
 * @export
 */
API.Client.User.prototype.firstName;

/**
 * @type {!string}
 * @export
 */
API.Client.User.prototype.lastName;

/**
 * @type {!string}
 * @export
 */
API.Client.User.prototype.gender;

/**
 * @type {!string}
 * @export
 */
API.Client.User.prototype.vendorsUsed;

/**
 * @type {!string}
 * @export
 */
API.Client.User.prototype.email;

/**
 * @type {!string}
 * @export
 */
API.Client.User.prototype.phoneNumber;

/**
 * @type {!Array<!API.Client.Address>}
 * @export
 */
API.Client.User.prototype.addresses;

/**
 * @type {!Array<!API.Client.Jean>}
 * @export
 */
API.Client.User.prototype.jeans;

