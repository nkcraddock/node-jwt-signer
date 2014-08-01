(function() {
  var fs = require('fs'),
      uuid = require('node-uuid'),
      http = require('http'),
      jwt = require('jsonwebtoken'),
      q = require('q');

  var privateKey = fs.readFileSync("private.pem");
  var algo = 'RS256';

  var data = {
    sub: uuid.v4(),
    iss: 'issuer-of-doom',
    exp: getExpiration(5)
  };

  http.createServer(function(req, res) {
    getJwtFromRequest(req).then(function(data) {
      var signed = jwt.sign(data, privateKey, { algorithm: algo }); 
      res.end(signed);
    });
  }).listen('1337', '127.0.0.1');

  function getExpiration(minutes) {
    return (Math.round(Date.now()) / 1000) + (minutes * 60);
  }

  function getJwtFromRequest(req) {
    var deferred = q.defer();

    var body = '';
    req.on('data', function(data) {
      body += data; 
    });
    req.on('end', function() {
      deferred.resolve(body);
    });

    return deferred.promise;
  } 

}).call(this);
