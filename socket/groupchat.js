const Users = require('../helpers/UsersClass');

module.exports = io => {
  const users = new Users();
  io.on('connection',socket => {
    socket.on('join',({room,sender},callback) => {
      socket.join(room);
      users.addUser(socket.id,sender,room);
      io.to(room).emit('usersList',users.getUsers(room));
      callback();
    });
    socket.on('createMessage', ({room,text,from},callback) => {
      io.to(room).emit('newMessage',{
        text,
        room,
        from
      });
      callback();
    });
    socket.on('disconnect',() => {
      const user = users.removeUser(socket.id);
      if(user) {
        io.to(user.room).emit('usersList',users.getUsers(user.room));
      }
    });
  });
};