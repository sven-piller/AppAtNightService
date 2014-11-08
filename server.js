/**
 * Main Server File
 *
 * JavaScript for Node.js
 *
 * LICENSE: MIT
 *
 * @file
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
// database models
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
 * @author Sven Piller <sven.piller@dlh.de>
 */
function log(message, level) {
  if (!level) {
    level = 'info';
  }
  logger(message, level, '[SERVER]');
}

/**
 * string for server URL
 * @constant
 * @type {String}
 * @default
 */
var serverUrl = 'http://' + properties.server.host + ':' + properties.server.port;

log('Server online: ' + serverUrl, 'info');
log(properties.server, 'debug');
log(properties.db, 'debug');

/**
 * string for database URL
 * @constant
 * @type {String}
 * @default
 */
var databaseUrl = 'mongodb://' + properties.db.host + '/' + properties.db.dbname;
/**
 * database object
 * @type {object}
 */
var db = mongoose.connection;
db.on('error', function() {
  log('Fehler bei der Anbindung der Datenbank', 'error');
});
db.once('open', function() {
  log('Anbindung der Datenbank ' + databaseUrl + ' in Ordnung');
});
mongoose.connect(databaseUrl);

// API
var app = express();
app.set('port', properties.server.port || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(methodOverride());
app.use(cookieParser());

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();

router.use(function(req, res, next) {
  // do logging
  log('Request at ' + Date.now(), 'debug', '[ROUTER]');
  log(req.body, 'debug', '[ROUTER]');
  next(); // make sure we go to the next routes and don't stop here
});

router.get('/', function(req, res) {
  res.json({
    message: 'API available'
  });
});

// on routes that end in /flights
// ----------------------------------------------------
router.route('/flights')

// create a flight
.post(function(req, res) {
  var flight = new Flight();
  flight.username = req.body.username;
  flight.origin = req.body.origin;
  flight.destination = req.body.destination;
  flight.departure = req.body.departure;
  flight.arrival = req.body.arrival;
  flight.flightnumber = req.body.flightnumber;
  flight.carrier = req.body.carrier;


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
  var query = Flight.find();
  if (req.query.destination) {
    query.where({
      destination: req.query.destination
    });
    //TODO: iterate over the array of usernames
  } else {
    //TODO: Errormessage, no username is given to the api
  }
  query.exec(function(err, flights) {
    if (err) {
      return next(err);
    } else {
      log(flights);
      res.send(flights);
    }
  });
});

// on routes that end in /flights/:flight_id
// ----------------------------------------------------
router.route('/flights/:flight_id')

// get the flight with that id
.get(function(req, res) {
  Flight.findById(req.params.flight_id, function(err, flight) {
    if (err) {
      res.send(err);
    }
    res.json(flight);
  });
})

// update the flight with this id
.put(function(req, res) {
    // use our bear model to find the bear we want
    Flight.findById(req.params.flight_id, function(err, flight) {
      if (err) {
        res.send(err);
      }
      // update the flights info
      flight.username = req.body.username;
      flight.save(function(err) {
        if (err) {
          res.send(err);
        }
        res.json({
          message: 'Flight updated!'
        });
      });

    });
  })
  // delete the flight with this id
  .delete(function(req, res) {
    Flight.remove({
      _id: req.params.flight_id
    }, function(err, flight) {
      if (err) {
        res.send(err);
      }

      res.json({
        message: 'Successfully deleted'
      });
    });
  });

// on routes that end in /searchflights
// ----------------------------------------------------
router.route('/searchflights')

// get all the flights
.post(function(req, res, next) {
  // flight.username = req.body.username;
  // flight.origin = req.body.origin;
  // flight.destination = req.body.destination;
  // flight.departure = req.body.departure;
  // flight.arrival = req.body.arrival;
  // flight.flightnumber = req.body.flightnumber;
  // flight.carrier = req.body.carrier;

  var query = Flight.find()
    .where('destination').equals(req.body.destination)
    .where('departure').equals(req.body.departure)
    //.where('departure').gt(17).lt(66)
    .where('username').in(req.body.usernames)
    .limit(20)
    .sort('-departure')
    //.select('username origin destination departure carrier flightnumber')
    .exec(function(err, flights) {
      if (err) {
        log(err, 'error');
        return next(err);
      } else {
        log(flights, 'debug');
        res.send(flights);
      }
    });
});


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.send(500, {
    message: err.message
  });
});

app.listen(app.get('port'), function() {
  logger('Express server listening on port ' + app.get('port'), 'info', '[EXPRESS]');
});
