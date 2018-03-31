class Users {
  constructor() {
    this.users = [];
  }
  addUser(id,name,room) {
    const newUser = {id, name, room};
    this.users.push(newUser);
    return newUser;
  }
  removeUser(id) {
    const user = this.getUser(id);
    if(user) {
      this.users = this.users.filter(user => user.id !== id);
      return user;
    }
  }
  getUser(id) {
    const user = this.users.filter(user => user.id === id)[0];
    return user;
  }
  getUsers(room) {
    const users = this.users.filter(user => user.room === room);
    return users.map(user => user.name);
  }
}

module.exports = Users;