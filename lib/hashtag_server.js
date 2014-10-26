var hashtagServer = function (server) {
  var io = require('socket.io')(server);
  var seenUsers = new Array();
  var hashtagList = {};
  var twitter = require('twitter');
  var currentTwitStream = null;
  var authTwit = new twitter({
        consumer_key: process.env.CONSUMER_KEY,
        consumer_secret: process.env.CONSUMER_SECRET,
        access_token_key: process.env.ACCESS_TOKEN_KEY,
        access_token_secret: process.env.ACCESS_TOKEN_SECRET
  });

  // Use this instead of assignment above when in local env
  // var authTwit = require('../node_modules/config');
  
  io.on('connection', function (socket) {
    
    // Store and convert entered hashtags to a comma seperate list for easy consumption by Twitter API.
    socket.on('hashtagsGiven', function (data) {
      Object.keys(data.tags).forEach( function (idx) {
        hashtagList[data.tags[idx]] = 0;
      });
      emitHashtagUpdate();
      var allHashtags = Object.keys(hashtagList).toString();
      getStream(allHashtags);
    });

    // Initiate connection to Twitter API. If a given tweet has a non-empty hashtag array, call chechHashtag().
    function getStream (allHashtags) {
      authTwit.stream('statuses/filter', 
        { track: allHashtags }, function(stream) {
          
        stream.on('data', function(data) {
          currentTwitStream = stream;
          if (data.entities && data.entities.hashtags.length > 0 ) {
            checkHashtag(data);
          }
        });
      });
    };
    
    // Compare hashtag array elements to hashtagList. If a match occurs, increment value of hashtag and call emitHashtagUpdate().
    function checkHashtag (data) {
      var actualHashtag = data.entities.hashtags[0].text.toLowerCase();
      Object.keys(hashtagList).forEach( function (key) {
        if (actualHashtag === key.toLowerCase()) {
          if (seenUsers.indexOf(data.user.id) === -1) {
            seenUsers.push(data.user.id);
            hashtagList[key] += 1;
            emitHashtagUpdate();  
          }
        }
      });
    };
    
    // Send updated hashtagList to client
    function emitHashtagUpdate (winner) {
      io.emit('hashtagUpdate', { hashtagList: hashtagList, winner: winner });
    };
    
    socket.on('resetHashtags', function () {
      stopStream();
    });
    
    socket.on('disconnect', function () {
      stopStream();
    });
    
    // Find hashtag with greatest value then call emitHashtagUpdate().
    socket.on('findWinner', function () {
      currentTwitStream.destroy();
      var winner = [null, 0];
      Object.keys(hashtagList).forEach( function (tag) {
        if (hashtagList[tag] >= winner[1]) {
          winner = [tag, hashtagList[tag]];
        }
      });
      emitHashtagUpdate.apply(null, winner);
    });
    
    // Stop stream and reset variables for next battle
    function stopStream () {
      if (currentTwitStream) {
        currentTwitStream.destroy();
        hashtagList = {};
        seenUsers = [];
        emitHashtagUpdate();
      }
    };
  });
};

module.exports = hashtagServer;