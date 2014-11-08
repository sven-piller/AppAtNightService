var mongoose = require('mongoose');
// config files
var properties = require('./../../config/config.json');
// lib files
var logger = require('./../../lib/libLogger').log;

var FlightSchema = new mongoose.Schema({
  username: String,
  origin: String,
  destination: String,
  departure: String,
  arrival: String,
  carrier: String,
  flightnumber: String
});

module.exports = mongoose.model('Flight', FlightSchema);
