var hashtagServer = function (server) {
  var io = require('socket.io')(server);
  var seenUsers = new Array();
  var hashtagList = {};
  
  var util = require('util');
  var twit = require('../node_modules/config');
  
  io.on('connection', function (socket) {
    
    socket.on('hashtagsGiven', function (data) {
      Object.keys(data.tags).forEach( function (idx) {
        hashtagList[data.tags[idx]] = 0;
      });
      emitHashtagUpdate();
      var allHashtags = Object.keys(hashtagList).toString();
      
      twit.twit.stream('statuses/filter', { track: allHashtags }, function(stream) {
        stream.on('data', function(data) {
          if (data.entities && data.entities.hashtags.length > 0 ) {
            Object.keys(hashtagList).forEach( function (key) {
              if (data.entities.hashtags[0].text.toLowerCase() === key.toLowerCase()) {
                if (seenUsers.indexOf(data.user.id) === -1) {
                  seenUsers.push(data.user.id);
                  console.log(util.inspect(data.entities.hashtags[0].text));
                  hashtagList[key] += 1;
                  emitHashtagUpdate();  
                }
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