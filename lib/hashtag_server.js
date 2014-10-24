var hashtagServer = function (server) {
  var io = require('socket.io')(server);
  var seenUsers = [];
  var hashtagList = {'rt':0, 'KCAArgentina':0};
  
  var util = require('util');
  var twit = require('../node_modules/config');
  
  io.on('connection', function (socket) {
    
    socket.on('hashtagsGiven', function (tags) {
      Object.keys(tags).forEach( function (idx) {
        hashtagList[tags[idx]] = 0;
      });
      emitHashtagUpdate();
      twit.twit.stream('statuses/sample', function(stream) {
        stream.on('data', function(data) {
          if (data.entities && data.entities.hashtags.length > 0 ) {
            Object.keys(hashtagList).forEach( function (key) {
              if (data.entities.hashtags[0].text.toLowerCase() === key.toLowerCase()) {
                console.log(util.inspect(data.entities.hashtags[0].text));
                hashtagList[key] += 1;
                emitHashtagUpdate();
              }
            });
          }
        });
      });
    });
    
    function emitHashtagUpdate () {
      io.emit('hashtagUpdate', { hashtagList: hashtagList });
    }
  });
};

module.exports = hashtagServer;