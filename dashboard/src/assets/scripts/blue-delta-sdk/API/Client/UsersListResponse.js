goog.provide('API.Client.UsersListResponse');

/**
 * @record
 */
API.Client.UsersListResponse = function() {}

/**
 * @type {!number}
 * @export
 */
API.Client.UsersListResponse.prototype.count;

/**
 * @type {!string}
 * @export
 */
API.Client.UsersListResponse.prototype.next;

/**
 * @type {!Array<!API.Client.User>}
 * @export
 */
API.Client.UsersListResponse.prototype.items;

