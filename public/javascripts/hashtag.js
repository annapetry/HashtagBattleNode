(function () {
  if (typeof App === 'undefined') {
    window.App = {};
  }
  
  var Hashtag = App.Hashtag = function (socket) {
    this.socket = socket;
  };

  Hashtag.prototype.sendHashtags = function (tags) {
    this.socket.emit('hashtagsGiven', { 
      tags: tags
    });
  };
  
  Hashtag.prototype.resetHashtags = function () {
    this.socket.emit('resetHashtags');
  };
  
  Hashtag.prototype.findWinner = function () {
    this.socket.emit('findWinner');
  }
  
})();