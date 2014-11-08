/**
 * Main Server File
 *
 * JavaScript for Node.js
 *
 * LICENSE: MIT
 *
 * @author       Travel Track 1
 * @copyright    Copyright (c) 2014
 * @license      MIT
 */

// npm packets
var mongoose = require('mongoose');
// config files
var properties = require('./config/config.json');
// lib files
var logger = require('./lib/libLogger').log;
var helper = require('./lib/libHelper');

/**
 * string with version number
 * @constant
 * @type {String}
 * @default
 */
var VERSION = '1.0';
/**
 * string with release tag
 * @constant
 * @type {String}
 * @default
 */
var RELEASE = '1.0.20141108';

/**  Utilities  **/

/**
 * format logging information. prefixes [SERVER] for each message
 *
 * @param {string} message - Log message
 * @param {string} level - Log level [debug, _info_, warn, error]
 *
 * @author Sven Piller <sven.piller@junior-comtec.de>
 */
function log(message, level) {
    if (!level) {
        level = 'info';
    }
    logger(message, level, '[SERVER]');
}

var serverUrl = 'http://'+ properties.server.host + ':' + properties.server.port;
log('Server online: ' + serverUrl , 'info');
log(properties.server, 'debug');
log(properties.db, 'debug');


// Check Connection to database
var databaseUrl = 'mongodb://' + properties.db.host + '/' + properties.db.dbname;
var db = mongoose.connection;

db.on('error', function() {
  log('Fehler bei der Anbindung der Datenbank', 'error');
});
db.once('open', function() {
  log('Anbindung der Datenbank ' + databaseUrl + ' in Ordnung');

  var flightSchema = new mongoose.Schema({
    _id: Number,
    username: [String],
    departure: String,
    destination: String,
    date: Date,
    time: Date,
    airline: String,
    flightnumber: String
  });

  var Flight = mongoose.model('Flight', flightSchema);
});

mongoose.connect(databaseUrl);
