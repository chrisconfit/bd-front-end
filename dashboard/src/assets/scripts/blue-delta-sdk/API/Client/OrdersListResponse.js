goog.provide('API.Client.OrdersListResponse');

/**
 * @record
 */
API.Client.OrdersListResponse = function() {}

/**
 * @type {!number}
 * @export
 */
API.Client.OrdersListResponse.prototype.count;

/**
 * @type {!string}
 * @export
 */
API.Client.OrdersListResponse.prototype.next;

/**
 * @type {!Array<!API.Client.Order>}
 * @export
 */
API.Client.OrdersListResponse.prototype.items;

