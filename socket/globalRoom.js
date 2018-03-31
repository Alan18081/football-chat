const GlobalRoom = require('../helpers/GlobalRoom');
const _ = require('lodash');

module.exports = io => {
  const clients = new GlobalRoom();
  io.on('connection',socket => {
    socket.on('globalRoom',({name,room,image}) => {
      socket.join(room);
      clients.enterGlobal(socket.id,name,room,image);
      const clientsList = clients.getGlobalUsers(room);
      const clientsListUnique = _.uniqBy(clientsList,'name');
      io.to(room).emit('loggedUser',clientsListUnique);
    });
    socket.on('disconnect',() => {
      const client = clients.removeGlobalUser(socket.id);
      if(client) {
        const clientsList = clients.getGlobalUsers(client.room);
        const arr = _.uniqBy(clientsList,'name');
        const removedList = _.remove(arr,{name: client.name});
        io.to(client.room).emit('loggedUser',removedList);
      }
    });
  });
};