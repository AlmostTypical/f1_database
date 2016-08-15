# Formula One
## API and website serving up 20 years of Formula One data

### Goals

1. Build an end to end application using real data
2. Work with complex mongoDB queries
3. Build a RESTful API
4. Handle different requests appropriately on the server
5. Build a full end to end website with real data
6. Understand MongoDB and mongoose
7. Work with server side HTML templates

### The API

The API will have the following routes:

#### Seasons

**Get all the seasons**
```
GET /api/seasons
```

**Get an individual season**
```
GET /api/seasons/:season_year
```

**Get events for a season**
```
GET /api/seasons/:season_year/events
```

**Get an individual event for a season**
```
GET /api/seasons/:season_year/events/:event_number
```

**Get the results for an event**
```
GET /api/seasons/:season_year/events/:event_number/results
```
#### Drivers

**Get all the drivers**
```
GET /api/drivers
```

**Get an individual driver**
```
GET /api/drivers/:driver_id
```

#### Constructors

**Get all the constructors**
```
GET /api/constructors
```

**Get an individual constructor**
```
GET /api/constructors/:constructor_id
```

#### Circuits

**Get all the circuits**
```
GET /api/circuits
```

**Get an individual circuit**
```
GET /api/circuits/:circuit_id
```
