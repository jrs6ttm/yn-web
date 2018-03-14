/*!
 * Connect - session - Store
 * Copyright(c) 2010 Sencha Inc.
 * Copyright(c) 2011 TJ Holowaychuk
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var EventEmitter = require('events').EventEmitter
    , Session = require('./session')
    , Cookie = require('./cookie');

/**
 * Initialize abstract `Store`.
 *
 * @api private
 */

var Store = module.exports = function Store(options) {
};

/**
 * Inherit from `EventEmitter.prototype`.
 */

Store.prototype.__proto__ = EventEmitter.prototype;

/**
 * Re-generate the given requests's session.
 *
 * @param {IncomingRequest} req
 * @return {Function} fn
 * @api public
 */

Store.prototype.regenerate = function (req, fn) {
    var self = this;
    this.destroy(req.sessionID, function (err) {
        self.generate(req);
        fn(err);
    });
};

/**
 * Load a `Session` instance via the given `sid`
 * and invoke the callback `fn(err, sess)`.
 *
 * @param {String} sid
 * @param {Function} fn
 * @api public
 */

Store.prototype.load = function (sid, fn) {
    var self = this;
    this.get(sid, function (err, sess) {
        if (err) return fn(err);
        if (!sess) return fn();
        var req = {sessionID: sid, sessionStore: self};
        sess = self.createSession(req, sess);
        fn(null, sess);
    });
};

/**
 * Create session from JSON `sess` data.
 *
 * @param {IncomingRequest} req
 * @param {Object} sess
 * @return {Session}
 * @api private
 */

Store.prototype.createSession = function (req, sess) {
    /**
     * kingdis ec_m_add:160619 if_block
     * Because the session data created by php-redis does not have the cookie obj, here we create it
     * in order to avaid the null pointer exception in "sess.cookie.expires"
     */

    if (!sess.cookie) {//ec_m_add:160619 if_block
        sess.cookie = {};
    }
    var expires = sess.cookie.expires
        , orig = sess.cookie.originalMaxAge;
    sess.cookie = new Cookie(sess.cookie);
    if ('string' == typeof expires) sess.cookie.expires = new Date(expires);
    sess.cookie.originalMaxAge = orig;
    req.session = new Session(req, sess);
    return req.session;
};
