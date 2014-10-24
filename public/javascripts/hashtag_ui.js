(function () {
  if (typeof App === 'undefined') {
    window.App = {};
  }
  
  var HashtagUi = window.App.HashtagUi = function (options) {
    this.hashtag = options.hashtag;
    this.$rootEl = options.$rootEl;
  };
  
  HashtagUi.prototype.hashtagList = function (hashtagList) {
    this.$rootEl.find('.tags').empty();
    var that = this;
    
    Object.keys(hashtagList).forEach(function (tag) {
      debugger
      var $header = $('<h3 class="' + tag + '"></h3>');
      $header.text(tag);
      that.$rootEl.find('.tags').append($header);
      
      var $uList = $('<ul></ul>');
      var $li = $('<li></li>');
      $li.text(hashtagList[tag]);
      $uList.append($li);
      
      that.$rootEl.find('.tags').append($uList);
    });
  };

  HashtagUi.prototype.getMessage = function () {
    var message = this.$rootEl.find('#msg').val();
    this.$rootEl.find('#msg').val('');
    message = message.split(',');
    return message;
  };

  HashtagUi.prototype.sendMessage = function () {
    var input = this.getMessage();
    this.hashtag.sendMessage(input);
  };

})();

$(function () {
   var socket = io();
   var hashtag = new App.Hashtag(socket);
   var ui = new App.HashtagUi({
     hashtag: hashtag,
     $rootEl: $('body')
   });
  
  socket.on('hashtagUpdate', function (data) {
    ui.hashtagList(data.hashtagList);
  });
   
  socket.on('message', function (data) {
    var message = data.text;
    ui.addMessage(message);
  });
  
  $('form').on('submit', function (event) {
    event.preventDefault();
    ui.sendMessage();
  });
});