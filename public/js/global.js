$(document).ready(() => {
  const socket = io();
  socket.on('connect', () => {
    const room = 'Global room';
    const name = $('#username').val();
    const image = $('#userImage').val();
    socket.emit('globalRoom',{
      room,
      name,
      image
    });
  });
  socket.on('loggedUser',users => {
    console.log(users);
    const container = $('#onlineFriends');
    const name = $('#username').val();
    const friendsStr = container.text();
    let onlineFriendLength = 0;
    const list = $('#onlineFriendsList');
    for(let i = 0; i < users.length; i++) {
      if(friendsStr.indexOf(users[i].name) !== -1) {
        const item = `
          <li>
            <img 
              src="http://placehold.it/50x50" 
              alt="User image" 
              class="pull-left img-circle"
              style="margin-right: 10px"
            >
            <a href="/chat/${users[i].name}.${name}">
              <strong>${users[i].name}</strong>
            </a>  
          </li>
        `;
        list.append(item);
        onlineFriendLength++;
      }
    }
    $('#onlineLength').text(`(${onlineFriendLength})`);
  });
});