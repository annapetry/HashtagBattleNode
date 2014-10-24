var hashtagServer = function (server) {
  var io = require('socket.io')(server);
  var seenUsers = new Array();
  var hashtagList = {};
  // var authTwit = require('../node_modules/config');
  
  // This will set auth credentials in Production
  var twitter = require('twitter');
  var authTwit = new twitter({
        consumer_key: process.env.CONSUMER_KEY,
        consumer_secret: process.env.CONSUMER_SECRET,
        access_token_key: process.env.ACCESS_TOKEN_KEY,
        access_token_secret: process.env.ACCESS_TOKEN_SECRET
  });
  
  io.on('connection', function (socket) {
    
    socket.on('hashtagsGiven', function (data) {
      Object.keys(data.tags).forEach( function (idx) {
        hashtagList[data.tags[idx]] = 0;
      });
      emitHashtagUpdate();
      var allHashtags = Object.keys(hashtagList).toString();
      getStream(allHashtags);
    });
    
    socket.on('resetHashtags', function () {
      currentTwitStream.destroy();
      hashtagList = {};
      seenUsers = [];
    });
    
    // be sure to use authTwit.twit in local 
    // be sure to use authTwit in prod
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
    }
    
    function checkHashtag (data) {
      Object.keys(hashtagList).forEach( function (key) {
        if (data.entities.hashtags[0].text.toLowerCase() === key.toLowerCase()) {
          if (seenUsers.indexOf(data.user.id) === -1) {
            seenUsers.push(data.user.id);
            hashtagList[key] += 1;
            emitHashtagUpdate();  
          }
        }
      });
    }
    
    function emitHashtagUpdate () {
      io.emit('hashtagUpdate', { hashtagList: hashtagList });
    }
  });
};

module.exports = hashtagServer;