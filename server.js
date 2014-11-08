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
var path = require('path');
var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
// config files
var properties = require('./config/config.json');
// lib files
var logger = require('./lib/libLogger').log;
var helper = require('./lib/libHelper');
// database files
var Flight = require('./app/models/flight');

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

var serverUrl = 'http://' + properties.server.host + ':' + properties.server.port;
log('Server online: ' + serverUrl, 'info');
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
});
mongoose.connect(databaseUrl);

var sampleRequest = {
  "username": "@svenpiller",
  "origin": "MUC",
  "destination": "FRA",
  "departure": "2014-11-09T11:30:12",
  "arrival": "2014-11-09T12:30:12",
  "flightnumber": "108",
  "carrier": "LH"
};

// API
var app = express();

app.set('port', properties.server.port || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(methodOverride());
app.use(cookieParser());
// app.use(session({ secret: 'keyboard cat' }));
// app.use(passport.initialize());
// app.use(passport.session());
// app.use(express.static(path.join(__dirname, 'public')));

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); // get an instance of the express Router

router.use(function(req, res, next) {
  // do logging
  log('Request at ' + Date.now(), 'debug', '[ROUTER]');
  log(req.body, 'debug', '[ROUTER]');
  next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
  res.json({
    message: 'API available'
  });
});

// more routes for our API will happen here

// on routes that end in /flights
// ----------------------------------------------------
router.route('/flights')

// create a flight
.post(function(req, res) {
  var flight = new Flight();
  flight.username = req.body.username;

  flight.save(function(err) {
    if (err) {
      log(err, 'error');
      res.send(err);
    } else {
      log(flight);
      res.send(flight);
      //res.json({ message: 'Flight created!' });
    }
  });
})

// get all the flights
.get(function(req, res) {
  Flight.find(function(err, flights) {
    if (err) {
      res.send(err);
    } else {
      res.json(flights);
    }
  });
});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);



/*
app.get('/api/flights', function(req, res, next) {
  var query = Flight.find();
  req.query = sampleRequest;
  if (req.query.username) {
    query.where({ username: req.query.username });
    //TODO: iterate over the array of usernames
  } else {
    //TODO: Errormessage, no username is given to the api
  }
  query.exec(function(err, flights) {
    if (err) {
      return next(err);
    }
    log(flights);
    res.send(flights);
  });
});

app.post()


app.get('*', function(req, res) {
  res.redirect('/#' + req.originalUrl);
});
*/
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.send(500, {
    message: err.message
  });
});

app.listen(app.get('port'), function() {
  logger('Express server listening on port ' + app.get('port'), 'info', '[EXPRESS]');
});
