var mongoose = require('mongoose');

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
