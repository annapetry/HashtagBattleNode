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

  HashtagUi.prototype.getHashtag = function () {
    var enteredHashtag = this.$rootEl.find('#tag').val();
    this.$rootEl.find('#tag').val('');
    enteredHashtag = enteredHashtag.split(',');
    debugger
    return enteredHashtag;
  };

  HashtagUi.prototype.sendHashtag = function () {
    var input = this.getHashtag();
    this.hashtag.sendHashtag(input);
  };
  
  HashtagUi.prototype.reset = function () {
    this.$rootEl.find('.tags').empty();
    this.hashtag.resetHashtags();
  }

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

  socket.on('enteredHashtag', function (data) {
    var enteredHashtag = data.text;
    ui.addHashtag(enteredHashtag);
  });

  $('form').on('submit', function (event) {
    event.preventDefault();
    ui.sendHashtag();
    $('form').hide();
    $('#reset').show();
  });

  $('#reset').on('click', function () {
    ui.reset();
    $('#reset').hide();
    $('form').show();
  });
});