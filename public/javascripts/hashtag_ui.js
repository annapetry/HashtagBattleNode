(function () {
  if (typeof App === 'undefined') {
    window.App = {};
  }
  
  var HashtagUi = window.App.HashtagUi = function (options) {
    this.hashtag = options.hashtag;
    this.$rootEl = options.$rootEl;
  };
  
  HashtagUi.prototype.hashtagList = function (hashtagList) {
    var tags = this.$rootEl.find('.tags');
    tags.empty();
    var that = this;
    Object.keys(hashtagList).forEach(function (tag) {
      var $col = $('<div class="col-md-3 single-tag"></div>')
      var $header = $('<h3 class="tag-name"></h3>');
      $header.text(tag);
      var $count = $('<p class="count"></p>');
      $count.text(hashtagList[tag]);
      $col.append($header);
      $col.append($count);
      tags.append($col);
    });
  };

  HashtagUi.prototype.getHashtag = function () {
    var tag = this.$rootEl.find('#tag');
    var enteredHashtag = tag.val();
    tag.val('');
    enteredHashtag = enteredHashtag.split(', ');
    return enteredHashtag;
  };

  HashtagUi.prototype.sendHashtag = function () {
    var input = this.getHashtag();
    this.hashtag.sendHashtag(input);
  };
  
  HashtagUi.prototype.reset = function () {
    this.$rootEl.find('.tags').empty();
    this.hashtag.resetHashtags();
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

  socket.on('enteredHashtag', function (data) {
    var enteredHashtag = data.text;
    ui.addHashtag(enteredHashtag);
  });

  $('form').on('submit', function (event) {
    event.preventDefault();
    ui.sendHashtag();
    $('form').hide();
    $('#instructions').hide();
    $('#reset').show();
  });

  $('#reset').on('click', function () {
    ui.reset();
    $('#reset').hide();
    $('form').show();
  });

  $('input').on('click', function () {
    $('#instructions').show();
  }); 
});