var results = {
  '1995': {},
  '1996': {},
  '1997': {},
  '1998': {},
  '1999': {},
  '2000': {},
  '2001': {},
  '2002': {},
  '2003': {},
  '2004': {},
  '2005': {},
  '2006': {},
  '2007': {},
  '2008': {},
  '2009': {},
  '2010': {},
  '2011': {},
  '2012': {},
  '2013': {},
  '2014': {},
  '2015': {}
};

for (var key in results) {
  require(`./${key}.json`).MRData.RaceTable.Races.forEach(function (race) {
    results[key][race.round] = {};
    race.Results.forEach(function (result) {
      results[key][race.round][result.position] = {
        driver: result.Driver,
        points: result.points,
        constructor: result.Constructor.constructorId,
        grid: result.grid,
        laps: result.laps,
        status: result.status,
        time: result.Time && result.Time.millis || 'N/A'
      };
    });
  });
}

module.exports = results;
