let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);

app.use((req, res, next) => {
  res.writeHead(200);
  res.end('hello world\n');
});

io.on('connection', (socket) => {

  socket.on('disconnect', function(){
    io.emit('users-changed', {user: socket.nickname, event: 'left'});
  });

  socket.on('set-nickname', (nickname) => {
    socket.nickname = nickname;
    io.emit('users-changed', {user: nickname, event: 'joined'});
    socket.join('CualquierRoom');
  });

  socket.on('add-message', (message) => {
    io.emit('message', {text: message.text, from: socket.nickname, created: new Date()});
    io.sockets.in('CualquierRoom').emit('message', {text: message.text, from: socket.nickname, created: new Date()});
  });
});

var port = process.env.PORT || 3001;

http.listen(port, function(){
   console.log('listening in http://localhost:' + port);
});
