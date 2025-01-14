# AppAtNightService

__Travel Track 1__ von [Lufthansa](http://www.lufthansa.com) während des [Hackathon App@Night](https://www.appatnight.de/) an der LMU München am Wochenende vom 07.11. - 09.11.2014.

Ausführen:
> node server.js

Dokumentation erstellen
> grunt jsdoc

## Verwendung


### Einen neuen Flug speichern
__request__
> POST http://appatnightservice.herokuapp.com/api/flights

    {
      "username"     : string,
      "origin"       : string,
      "destination"  : string,
      "departure"    : string,
      "arrival"      : string,
      "carrier"      : string,
      "flightnumber" : string,
      "friends"      : [string]
    }

__example__

    {
      "username"     : "maxmustermann",
      "origin"       : "MUC",
      "destination"  : "FRA",
      "departure"    : "2014-11-09T11:30:12",
      "arrival"      : "2014-11-09T12:30:12",
      "carrier"      : "LH",
      "flightnumber" : "108",
      "friends"      : "susisorglos"
    }

__response__

    {
      "__v"          : 0,
      "carrier"      : "LH",
      "flightnumber" : "108",
      "arrival"      : "2014-11-09T12:30:12",
      "departure"    : "2014-11-09T11:30:12",
      "departureDate": "2014-11-09T11:30:12.000Z",
      "identifier"   : "LH-108-2014-11-09",
      "destination"  : "FRA",
      "origin"       : "MUC",
      "username"     : "maxmustermann",
      "_id"          : "545e4110a9b586082fbea976"
    }

### Alle Flüge zu den übergebenen Freunden suchen
Es werden alle Einträge in der Datenbank zurückgegeben, auf die die Kriterien zutreffen.
Dabei wird die Destination auf Gleichheit geprüft. Der Username wird in dem Array mit allen bekannten Usernamen
abgeglichen. Die zu suchenden Flüge liegen in einem Zeitfenster von dem gewünschten Abflugtag +/- der Tage im
Parameter _timerange_.

__request__
> POST http://appatnightservice.herokuapp.com/api/searchflights

    {
      "friends"      : [string],
      "destination"  : string,
      "departure"    : string,
      "timerange"    : integer
    }

__example__

    {
      "friends"      : "maxmustermann",
      "friends"      : "susisorglos",
      "destination"  : "FRA",
      "departure"    : "2014-11-09T11:30:12",
      "timerange"    : 2
    }

__response__

    {
      "__v"          : 0,
      "carrier"      : "LH",
      "flightnumber" : "108",
      "arrival"      : "2014-11-09T12:30:12",
      "departure"    : "2014-11-09T11:30:12",
      "departureDate": "2014-11-09T11:30:12.000Z",
      "identifier"   : "LH-108-2014-11-09",
      "destination"  : "FRA",
      "origin"       : "MUC",
      "username"     : "maxmustermann",
      "_id"          : "545e4110a9b586082fbea976"
    }

### Alle Flüge auslesen
__request__
> GET http://appatnightservice.herokuapp.com/api/flights

__response__

    {
      "__v"          : 0,
      "carrier"      : "LH",
      "flightnumber" : "108",
      "arrival"      : "2014-11-09T12:30:12",
      "departure"    : "2014-11-09T11:30:12",
      "departureDate": "2014-11-09T11:30:12.000Z",
      "identifier"   : "LH-108-2014-11-09",
      "destination"  : "FRA",
      "origin"       : "MUC",
      "username"     : "maxmustermann",
      "_id"          : "545e4110a9b586082fbea976"
    }, {
      "__v"          : 0,
      "carrier"      : "LH",
      "flightnumber" : "108",
      "arrival"      : "2014-11-09T12:30:12",
      "departure"    : "2014-11-09T11:30:12",
      "departureDate": "2014-11-09T11:30:12.000Z",
      "identifier"   : "LH-108-2014-11-09",
      "destination"  : "FRA",
      "origin"       : "MUC",
      "username"     : "susisorglos",
      "_id"          : "545e4110a9b586082fbea976"
    }

### Einen Flug anhand der ID auslesen
__request__
> GET http://appatnightservice.herokuapp.com/api/flights/flight_id

__response__

    {
      "__v"          : 0,
      "carrier"      : "LH",
      "flightnumber" : "108",
      "arrival"      : "2014-11-09T12:30:12",
      "departure"    : "2014-11-09T11:30:12",
      "departureDate": "2014-11-09T11:30:12.000Z",
      "identifier"   : "LH-108-2014-11-09",
      "destination"  : "FRA",
      "origin"       : "MUC",
      "username"     : "maxmustermann",
      "_id"          : "545e4110a9b586082fbea976"
    }

### Einen Flug verändern anhand der ID
__request__
> PUT http://appatnightservice.herokuapp.com/api/flights/flight_id

    {
      "username"     : string,
      ...
    }

__example__

    {
      "departure"    :"2014-11-09T10:30:12",
    }

__response__

    {
      "__v"          : 0,
      "carrier"      : "LH",
      "flightnumber" : "108",
      "arrival"      : "2014-11-09T12:30:12",
      "departure"    : "2014-11-09T10:30:12",
      "departureDate": "2014-11-09T10:30:12.000Z",
      "identifier"   : "LH-108-2014-11-09",
      "destination"  : "FRA",
      "origin"       : "MUC",
      "username"     : "maxmustermann",
      "_id"          : "545e4110a9b586082fbea976"
    }
