var hashtagServer = function (server) {
  var io = require('socket.io')(server);
  var seenUsers = [];
  var currentHashtagCounts = {};
  var hashtags = {}
  
  var util = require('util'),
      twitter = require('twitter');
    
  var twit = new twitter({
      
  });
  
  io.on('connection', function (socket) {
    
    socket.on('message', function (data) {
      hashtags[data.hashtag];
      io.sockets.emit('message', data);
    });
    
    twit.stream('statuses/sample', function(stream) {
        stream.on('data', function(data) {
          if (data.entities && data.entities.hashtags.length > 0 ) {
            
            //run through hashtags to check for a match
            // if there is a match, increment count and emitHashtagCounts
            
            
            if (data.entities.hashtags[0].text === "KCAArgentina") {
              console.log(util.inspect(data.entities.hashtags[0].text));
            }
          }
        });
    });
    
    function emitHashtagCounts () {
      buildHashtagCounts();
      io.emit('hashtagCounts', { currentHashtagCounts: currentHashtagCounts });
    }
    
    function buildHashtagCounts () {
      currentHashtagCounts = {};
      
      Object.keys(hashtags).forEach(function () {
        // need to update the counts here??  at least rebuild the list with the current counts
      });
    }
    
  });
  
};

module.exports = hashtagServer;