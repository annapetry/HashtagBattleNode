var startServer = require('./hashtag_server');

var http = require('http'),
  static = require('node-static'),
  socketio = require('socket.io');

var file = new static.Server('./public',  { cache: false });

var server = http.createServer(function (req, res) {
  req.addListener('end', function () {
    file.serve(req, res);
  }).resume();
});

server.listen(process.env.PORT || 3000);

startServer(server);