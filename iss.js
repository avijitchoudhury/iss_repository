const request = require('request');


const fetchMyIP = function(callback) {
  request('https://api.ipify.org?format=json', (error, response, body) => {

    if (error) return callback(error, null);

    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching IP: ${body}`), null);
      return;
    };

    const ip = JSON.parse(body).ip;
    callback(null, ip);
  });
};

const fetchCoordsByIP = function (ip, callback) {
  request('https://ipvigilante.com/8.8.8.8', (error, response, body) => {
  if (error) {
    callback(error, null);
    return;
  }; 
    if (response.statusCode !== 200) {
    callback (Error (`Status Code ${response.statusCode} when fetching IP: ${body}`), null);
    return;
  };

  const { latitude, longitude } = JSON.parse(body).data;
  callback (null, { latitude, longitude });
});
};

const fetchISSFlyOverTimes = function (coords, callback) {
  let URL = `http://api.open-notify.org/iss-pass.json?lat=${coords.latitude}&lon=${coords.longitude}`
  request (URL, (error, response, body) => {
    if(error) {
      callback (error, null);
      return;
    };  
      if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching IP: ${body}`), null);
      return;
    };
    const passes = JSON.parse(body).response;
    callback (error, passes);
  }); 
};

const nextISSTimesForMyLocation = function (callback) {
  fetchMyIP((error, IP) => {
    if (error) {
      return callback (error, null)
    };
    fetchCoordsByIP ((error, loc) => {
      if (error) {
        return callback (error, null);
      };

      fetchISSFlyOverTimes (loc, (error, nextPasses) => {
        if (error) {
          return callback(error, null);
        };

        callback(null, nextPasses);
      });
    });
  });
};

module.exports = { 
  fetchMyIP, 
  fetchCoordsByIP ,
  fetchISSFlyOverTimes,
  nextISSTimesForMyLocation
};


