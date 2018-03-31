module.exports = io => {
  io.on('connection', socket => {
    socket.on('joinPM',({room1,room2},cb) => {
      socket.join(room1);
      socket.join(room2);
      cb();
    });

    socket.on('privateMessage',({text,sender,room},cb) => {
      io.to(room).emit('newPM',{
        text,
        sender,
        room
      });
      io.emit('messageDisplay',{});
      cb();
    });
  });
};