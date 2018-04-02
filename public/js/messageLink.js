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

    socket.on('newRefresh', () => {
      $('#reload').load(`${location.href} #reload`);
    })
  });
  $(document).on('click','.messageLink',e => {
    const chatId = $(e.target).data().value;
    $.ajax({
      url: `/chat/${paramOne}`,
      type: 'POST',
      data: {
        chatId
      },
      success() {

      }
    })
  });
});