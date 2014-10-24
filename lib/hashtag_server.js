var hashtagServer = function (server) {
  var io = require('socket.io')(server);
  var seenUsers = new Array();
  var hashtagList = {};
  // var authTwit = require('../node_modules/config');
  
  // This will set auth credentials in Production
  var twitter = require('twitter');
  authTwit.twit = new twitter({
        consumer_key: ENV['CONSUMER_KEY'],
        consumer_secret: ENV['CONSUMER_SECRET'],
        access_token_key: ENV['ACCESS_TOKEN_KEY'],
        access_token_secret: ENV['ACCESS_TOKEN_SECRET']
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
      hashtagList = {};
      seenUsers = [];
    });
    
    function getStream (allHashtags) {
      authTwit.twit.stream('statuses/filter', 
        { track: allHashtags }, function(stream) {
          
        stream.on('data', function(data) {
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
    
    io.on('disconnect', function () {
      io = require('socket.io')(server);
    })
  });
};

module.exports = hashtagServer;