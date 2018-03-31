$(document).ready(() => {
  const socket = io();
  const paramOne = $.deparam(location.pathname);
  const paramsList = paramOne.split('.');
  $('#receiver-name').text(decodeURIComponent(paramsList[0]));
  console.log(paramOne);
  const temp = paramsList[0];
  paramsList[0] = paramsList[1];
  paramsList[1] = temp;
  const paramTwo = paramsList[0] + '.' + paramsList[1];
  console.log(paramTwo);
  socket.on('connect',() => {
    const params = {
      room1: paramOne,
      room2: paramTwo
    };
    socket.emit('joinPM',params,() => {
      console.log('User joined PM');
    });

    socket.on('messageDisplay', () => {
      $('#new-messages').load(`${location.href} #new-messages`);
    });
  });

  socket.on('newPM',({room,text,sender}) => {
    console.log(sender,room,text);
    const template = $('#message-template').html();
    const message = Mustache.render(template,{
      text,
      sender
    });
    $('.messages').append(message);
  });

  $('#message_send').on('click',() => {
    const message = $('#message-input').val();
    const sender = $('#username').val();
    if(message.trim().length > 0) {
      $.ajax({
        url: '/chat/' + paramOne,
        type: 'POST',
        data: {
          message
        }
      });
      socket.emit('privateMessage',{
        text: message,
        sender,
        room: paramOne
      },() => {
        $('#message-input').val('');
      });
    }
  });
});