(function () {
  if (typeof App === 'undefined') {
    window.App = {};
  }
  
  var Hashtag = App.Hashtag = function (socket) {
    this.socket = socket;
  };

  Hashtag.prototype.sendMessage = function (tags) {
    this.socket.emit('hashtagsGiven', { 
      tags: tags
    });
  };
  
})();