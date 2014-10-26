(function () {
  if (typeof App === 'undefined') {
    window.App = {};
  }
  
  var HashtagUi = window.App.HashtagUi = function (options) {
    this.hashtag = options.hashtag;
    this.$rootEl = options.$rootEl;
  };
  
  HashtagUi.prototype.addToDOM = function (data) {
    var hashtagList = data.hashtagList;
    var winner = data.winner;
    var tags = this.$rootEl.find('.tags');
    tags.empty();
    var that = this;
    Object.keys(hashtagList).forEach(function (tag) {
      var $col = $('<div class="col-md-3 single-tag"></div>');
      if (winner && winner === tag) {
        $col.attr('id', 'winner');
      }
      var $header = $('<h3 class="tag-name"></h3>');
      $header.text(tag);
      var $count = $('<p class="count"></p>');
      $count.text(hashtagList[tag]);
      $col.append($header);
      $col.append($count);
      tags.append($col);
    });
  };

  HashtagUi.prototype.getHashtags = function () {
    var tag = this.$rootEl.find('#tag');
    var enteredHashtags = tag.val();
    tag.val('');
    enteredHashtags = enteredHashtags.split(', ');
    return enteredHashtags;
  };

  HashtagUi.prototype.sendHashtags = function () {
    var input = this.getHashtags();
    this.hashtag.sendHashtags(input);
  };
  
  HashtagUi.prototype.reset = function () {
    this.$rootEl.find('.tags').empty();
    this.hashtag.resetHashtags();
  };
  
  HashtagUi.prototype.findWinner = function () {
    this.hashtag.findWinner();
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
    ui.addToDOM(data);
  });

  socket.on('enteredHashtag', function (data) {
    var enteredHashtags = data.text;
    ui.addHashtags(enteredHashtags);
  });

  $('form').on('submit', function (event) {
    event.preventDefault();
    ui.sendHashtags();
    $('form').hide();
    $('#instructions').hide();
    $('#reset').show();
    $('#show-winner').show();
  });

  $('#reset').on('click', function () {
    ui.reset();
    $('#reset').hide();
    $('#show-winner').hide();
    $('form').show();
  });

  $('input').on('click', function () {
    $('#instructions').fadeToggle("fast", "linear");
  }); 
  
  $('#show-winner').on('click', function () {
    ui.findWinner();
  });

});