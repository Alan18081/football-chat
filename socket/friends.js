module.exports = io => {
  io.on('connection', socket => {
    socket.on('joinRequest',(req,callback) => {
      socket.join(req.sender);
      callback();
    });
    socket.on('friendRequest',({receiver,sender},callback) => {
      io.to(receiver).emit('newFriendRequest',{
        from: sender,
        to: receiver
      });
      callback();
    });
  });
};