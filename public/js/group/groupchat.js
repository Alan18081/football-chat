$(document).ready(() => {
  const socket = io();
  const room = $('#groupName').val();
  const sender = $('#sender').val();
  const userImage = $('#userImage').val();
  socket.on('connect',() => {
    const params = {
      room,
      sender
    };
    socket.emit('join',params,() => {
      console.log('User has joined this room');
    });
  });
  socket.on('newMessage',({room,text,from,image}) => {
    const template = $('#message-template').html();
    const message = Mustache.render(template,{
      text,
      image,
      sender: from
    });
    $('.messages').append(message);
    console.log(room,text,from);
  });

  socket.on('usersList',users => {
    const ol = $('<ol></ol>');
    console.log(users);
    for(let user of users) {
      ol.append(`<li><p><a class="user-link" data-toggle="modal" data-target="#friendModal">${user}</a></p></li>`);
    }
    $(document).on('click','.user-link',e => {
      const name = $(e.target).text();
      $('#modal-name').text(name);
      $('#viewProfile').attr('href',`/profile/${name}`);
    });
    $('#users-length').text(`(${users.length})`);
    $('#users').html(ol);
  });


  $('#message-send').on('click',e => {
    const message = $('#message-input').val();
    socket.emit('createMessage',{
      text: message,
      room,
      from: sender
    },() => {
      $('#message-input').val('');
    });
    $.ajax({
      url: `/group/${room}/saveMessage`,
      type: 'POST',
      data: {
        message,
        room
      },
      success() {
        $('#message-input').val('');
      }
    })
  });
});