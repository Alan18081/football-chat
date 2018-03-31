class GlobalRoom {
  constructor() {
    this.globalRoom = [];
  }
  enterGlobal(id,name,room,image) {
    const roomName = {id, name, room, image};
    this.globalRoom.push(roomName);
    return roomName;
  }
  getGlobalUsers(room) {
    const clients = this.globalRoom.filter(client => client.room === room);
    return clients.map(({name,image}) => ({
      name,
      image
    }));
  }
  removeGlobalUser(id) {
    const client = this.getGlobalUser(id);
    if(client) {
      this.globalRoom = this.globalRoom.filter(client => client.id !== id);
      return client;
    }
  }
  getGlobalUser(id) {
    const client = this.globalRoom.filter(client => client.id === id)[0];
    return client;
  }
}

module.exports = GlobalRoom;